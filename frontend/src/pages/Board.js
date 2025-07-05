import React, { useEffect, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import TaskCard from '../components/TaskCard';
import { getApiUrl, getSocketUrl } from '../config/api';
import './Board.css';

const socket = io(getSocketUrl());

const columns = [
  { key: 'Todo', label: 'Todo' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Done', label: 'Done' },
];

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem('token');
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });
  const [isDragging, setIsDragging] = useState(false);
  const [dragTasks, setDragTasks] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Validation helper
  const validateTaskTitle = (title, excludeTaskId = null) => {
    const trimmedTitle = title.trim();
    
    // Check if title is empty
    if (!trimmedTitle) {
      return 'Task title is required';
    }

    // Check if title matches column names
    const columnNames = columns.map(col => col.label.toLowerCase());
    if (columnNames.includes(trimmedTitle.toLowerCase())) {
      return 'Task title cannot match column names (Todo, In Progress, Done)';
    }

    // Check if title is unique
    const existingTask = tasks.find(task => 
      task._id !== excludeTaskId && 
      task.title.toLowerCase() === trimmedTitle.toLowerCase()
    );
    if (existingTask) {
      return 'Task title must be unique';
    }

    return '';
  };

  // Clear messages after timeout
  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setError('');
      setSuccessMessage('');
    }, 3000);
  }, []);

  // Fetch tasks and users
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/tasks'), { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      clearMessages();
    } finally {
      setLoading(false);
    }
  }, [token, clearMessages]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl('/api/auth/users'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers([]);
    }
  }, [token]);

  useEffect(() => { 
    fetchTasks(); 
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  // Real-time sync
  useEffect(() => {
    const handleRefresh = () => {
      // Don't refresh during dragging to prevent drag conflicts
      if (!isDragging) {
        fetchTasks();
      }
    };

    const handleTaskUpdate = (updatedTask) => {
      // Don't update during dragging to prevent drag conflicts
      if (!isDragging) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === updatedTask._id ? updatedTask : task
          )
        );
      }
    };

    const handleTaskDelete = (deletedTaskId) => {
      // Don't update during dragging to prevent drag conflicts
      if (!isDragging) {
        setTasks(prevTasks => 
          prevTasks.filter(task => task._id !== deletedTaskId)
        );
      }
    };

    const handleTaskCreate = (newTask) => {
      // Don't update during dragging to prevent drag conflicts
      if (!isDragging) {
        setTasks(prevTasks => [...prevTasks, newTask]);
      }
    };

    socket.on('refreshTasks', handleRefresh);
    socket.on('taskUpdated', handleTaskUpdate);
    socket.on('taskDeleted', handleTaskDelete);
    socket.on('taskCreated', handleTaskCreate);

    return () => {
      socket.off('refreshTasks', handleRefresh);
      socket.off('taskUpdated', handleTaskUpdate);
      socket.off('taskDeleted', handleTaskDelete);
      socket.off('taskCreated', handleTaskCreate);
    };
  }, [fetchTasks, isDragging]);

  // Drag-and-drop
  const onDragStart = (start) => {
    console.log('Drag started:', start.draggableId);
    setIsDragging(true);
    // Create a deep copy of tasks to prevent reference issues
    setDragTasks(tasks.map(task => ({ ...task })));
  };

  const onDragEnd = async (result) => {
    console.log('Drag ended:', result);
    setIsDragging(false);
    setDragTasks(null);
    
    if (!result.destination) {
      console.log('No destination, drag cancelled');
      return;
    }
    
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const task = tasks.find(t => t._id === taskId);
    
    if (!task) {
      console.error('Task not found for drag:', taskId);
      return;
    }
    
    if (task.status === newStatus) {
      console.log('Task already in same status, no change needed');
      return;
    }

    console.log(`Moving task "${task.title}" from ${task.status} to ${newStatus}`);

    // Optimistic update
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      )
    );

    try {
      const res = await fetch(getApiUrl(`/api/tasks/${taskId}`), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          status: newStatus, 
          updatedAt: task.updatedAt 
        })
      });

      if (res.status === 409) {
        const data = await res.json();
        setConflict({ 
          local: { ...task, status: newStatus }, 
          server: data.serverTask 
        });
        // Revert optimistic update
        setTasks(prevTasks =>
          prevTasks.map(t =>
            t._id === taskId ? task : t
          )
        );
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to update task');
      }

      socket.emit('taskChanged', { taskId, newStatus });
      setSuccessMessage('Task moved successfully!');
      clearMessages();
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      clearMessages();
      // Revert optimistic update
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t._id === taskId ? task : t
        )
      );
    }
  };

  // Task actions
  const handleEdit = async (editData) => {
    const validationError = validateTaskTitle(editData.title, editData._id);
    if (validationError) {
      setError(validationError);
      clearMessages();
      return;
    }

    try {
      const res = await fetch(getApiUrl(`/api/tasks/${editData._id}`), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          ...editData, 
          updatedAt: editData.updatedAt 
        })
      });

      if (res.status === 409) {
        const data = await res.json();
        setConflict({ local: editData, server: data.serverTask });
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to update task');
      }

      socket.emit('taskChanged', { taskId: editData._id });
      setSuccessMessage('Task updated successfully!');
      clearMessages();
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
      clearMessages();
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const res = await fetch(getApiUrl(`/api/tasks/${task._id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to delete task');
      }

      socket.emit('taskChanged', { taskId: task._id, action: 'delete' });
      setSuccessMessage('Task deleted successfully!');
      clearMessages();
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
      clearMessages();
    }
  };

  const handleAssign = async (task, userId) => {
    try {
      const res = await fetch(getApiUrl(`/api/tasks/${task._id}`), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          assignedUser: userId || null, 
          updatedAt: task.updatedAt 
        })
      });

      if (!res.ok) {
        throw new Error('Failed to assign task');
      }

      socket.emit('taskChanged', { taskId: task._id });
      setSuccessMessage('Task assigned successfully!');
      clearMessages();
      fetchTasks();
    } catch (err) {
      setError('Failed to assign task');
      clearMessages();
    }
  };

  const handleSmartAssign = async (task) => {
    try {
      setSuccessMessage('Finding best user to assign...');
      
      const res = await fetch(getApiUrl(`/api/tasks/${task._id}/smart-assign`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to smart assign');
      }

      const updatedTask = await res.json();
      console.log('Smart assign result:', updatedTask);

      // Update the specific task in the state optimistically
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t._id === task._id ? updatedTask : t
        )
      );

      socket.emit('taskChanged', { taskId: task._id });
      
      const assignedUserName = updatedTask.assignedUser?.username || 'Unknown User';
      setSuccessMessage(`Task smart assigned to ${assignedUserName}!`);
      clearMessages();
    } catch (err) {
      console.error('Smart assign error:', err);
      setError(err.message || 'Failed to smart assign');
      clearMessages();
    }
  };

  // Conflict resolution
  const handleConflict = async (action) => {
    if (!conflict) return;

    try {
      if (action === 'overwrite') {
        await handleEdit(conflict.local);
      } else if (action === 'merge') {
        // For merge, we keep the server version but could implement field-by-field merging
        setTasks(prevTasks =>
          prevTasks.map(t =>
            t._id === conflict.server._id ? conflict.server : t
          )
        );
        setSuccessMessage('Conflict resolved with server version');
        clearMessages();
      }
    } catch (err) {
      setError('Failed to resolve conflict');
      clearMessages();
    } finally {
      setConflict(null);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});

    const validationError = validateTaskTitle(newTask.title);
    if (validationError) {
      setValidationErrors({ title: validationError });
      return;
    }

    try {
      const res = await fetch(getApiUrl('/api/tasks'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...newTask,
          status: 'Todo' // Default status
        })
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.message && data.message.includes('title')) {
          setValidationErrors({ title: data.message });
        } else {
          setError(data.message || 'Failed to create task');
          clearMessages();
        }
        return;
      }

      setNewTask({ title: '', description: '', priority: 'Medium' });
      setValidationErrors({});
      socket.emit('taskChanged', { action: 'create' });
      setSuccessMessage('Task created successfully!');
      clearMessages();
      fetchTasks();
    } catch (err) {
      setError('Failed to create task');
      clearMessages();
    }
  };

  // Render tasks - use dragTasks during dragging for smooth experience
  const renderTasks = isDragging && dragTasks ? dragTasks : tasks;

  // Helper function to ensure stable draggable items
  const getStableTasks = () => {
    return renderTasks.filter(task => task && task._id);
  };

  if (loading) {
    return (
      <div className="board-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="board-container">
      <div className="board-header">
        <h2 className="board-title">📋 Kanban Board</h2>
        <div className="board-actions">
          <Link to="/activity" className="activity-btn">
            📊 Activity Log
          </Link>
        </div>
        <div className="board-stats">
          <span className="stat">
            📝 {tasks.length} Tasks
          </span>
          <span className="stat">
            👥 {users.length} Users
          </span>
          {/* Debug info for smart assign testing */}
          <button 
            className="debug-btn"
            onClick={async () => {
              console.log('=== SMART ASSIGN DEBUG ===');
              
              // Frontend calculation
              console.log('Frontend calculation:');
              users.forEach(user => {
                const activeTasks = tasks.filter(task => 
                  task.assignedUser?._id === user._id && task.status !== 'Done'
                ).length;
                console.log(`${user.username}: ${activeTasks} active tasks`);
              });
              
              // Backend verification
              try {
                const res = await fetch(getApiUrl('/api/tasks/debug'), {
                  headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                  const backendCounts = await res.json();
                  console.log('Backend calculation:', backendCounts);
                } else {
                  console.log('Failed to fetch backend counts');
                }
              } catch (err) {
                console.log('Error fetching backend counts:', err);
              }
            }}
            title="Click to see user task counts in console"
          >
            🔍 Debug
          </button>
        </div>
      </div>

      {/* Create Task Form */}
      <form className="new-task-form" onSubmit={handleCreateTask}>
        <div className="form-group">
          <input
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title (must be unique)"
            required
            className={validationErrors.title ? 'error' : ''}
          />
          {validationErrors.title && (
            <span className="validation-error">{validationErrors.title}</span>
          )}
        </div>
        <input
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task description (optional)"
        />
        <select
          value={newTask.priority}
          onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="Low">🟢 Low Priority</option>
          <option value="Medium">🟡 Medium Priority</option>
          <option value="High">🔴 High Priority</option>
        </select>
        <button type="submit" className="add-task-btn">
          ➕ Add Task
        </button>
      </form>

      {/* Messages */}
      {error && <div className="board-error">❌ {error}</div>}
      {successMessage && <div className="board-success">✅ {successMessage}</div>}

      {/* Kanban Board */}
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="board-columns">
          {columns.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => (
                <div
                  className={`board-column ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="board-column-header">
                    <h3 className="board-column-title">{col.label}</h3>
                    <span className="task-count">
                      {renderTasks.filter(t => t.status === col.key).length}
                    </span>
                  </div>
                  
                  <div className="column-tasks">
                    {getStableTasks()
                      .filter(t => t.status === col.key)
                      .map((task, index) => {
                        const draggableId = String(task._id);
                        const uniqueKey = `${task._id}-${task.status}-${task.updatedAt || ''}`;
                        
                        return (
                          <Draggable
                            draggableId={draggableId}
                            index={index}
                            key={uniqueKey}
                            isDragDisabled={false}
                          >
                            {(provided, snapshot) => (
                              <TaskCard
                                task={task}
                                users={users}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onAssign={handleAssign}
                                onSmartAssign={handleSmartAssign}
                                draggableProps={provided.draggableProps}
                                dragHandleProps={provided.dragHandleProps}
                                isDragging={snapshot.isDragging}
                                ref={provided.innerRef}
                                validateTitle={(title) => validateTaskTitle(title, task._id)}
                              />
                            )}
                          </Draggable>
                        );
                      })}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Conflict Resolution Modal */}
      {conflict && (
        <div className="conflict-modal-overlay">
          <div className="conflict-modal">
            <div className="conflict-header">
              <h3>⚠️ Conflict Detected</h3>
              <p>Another user has updated this task while you were editing it.</p>
            </div>
            
            <div className="conflict-content">
              <div className="conflict-version">
                <h4>Your Version:</h4>
                <div className="task-preview">
                  <strong>{conflict.local.title}</strong>
                  <p>{conflict.local.description}</p>
                  <span className="task-meta">
                    Status: {conflict.local.status} | Priority: {conflict.local.priority}
                  </span>
                </div>
              </div>
              
              <div className="conflict-version">
                <h4>Server Version:</h4>
                <div className="task-preview">
                  <strong>{conflict.server.title}</strong>
                  <p>{conflict.server.description}</p>
                  <span className="task-meta">
                    Status: {conflict.server.status} | Priority: {conflict.server.priority}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="conflict-actions">
              <button 
                onClick={() => handleConflict('overwrite')}
                className="btn-overwrite"
              >
                📝 Overwrite
              </button>
              <button 
                onClick={() => handleConflict('merge')}
                className="btn-merge"
              >
                🔄 Merge
              </button>
              <button 
                onClick={() => setConflict(null)}
                className="btn-cancel"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
