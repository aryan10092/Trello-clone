import React, { useState } from 'react';
import './TaskCard.css';

const TaskCard = React.forwardRef(({ task, users, onEdit, onDelete, onAssign, onSmartAssign, draggableProps, dragHandleProps, isDragging, validateTitle }, ref) => {
  const [flipped, setFlipped] = useState(false);
  const [editData, setEditData] = useState({ ...task });
  const [validationError, setValidationError] = useState('');

  const handleEdit = () => setFlipped(true);
  const handleCancel = () => { 
    setFlipped(false); 
    setEditData({ ...task }); 
    setValidationError('');
  };
  
  const handleSave = () => { 
    if (validateTitle) {
      const error = validateTitle(editData.title);
      if (error) {
        setValidationError(error);
        return;
      }
    }
    onEdit(editData); 
    setFlipped(false);
    setValidationError('');
  };

  return (
    <div className={`task-card${flipped ? ' flipped' : ''}${isDragging ? ' dragging' : ''}`} ref={ref} {...draggableProps} {...dragHandleProps}>
      <div className="task-card-front">

        <div className="task-title">{task.title}</div>
        <div className="task-desc">{task.description}</div>
        <div className="task-meta">

          <span className={`task-priority priority-${task.priority?.toLowerCase()}`}>

            {task.priority === 'High' ? '🔴' : task.priority === 'Medium' ? '🟡' : '🟢'} 
            {task.priority}
          </span>

          <span className={`task-status status-${task.status?.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
        </div>

        <div className="task-assigned">
          {task.assignedUser?.username ? `👤 ${task.assignedUser.username}` : '👤 Unassigned'}
        </div>

        <div className="task-actions">
          <button onClick={handleEdit} className="edit-btn" title="Edit Task">✏️</button>
          
          <button onClick={() => onDelete(task)} className="delete-btn" title="Delete Task">🗑️</button>
          <button onClick={() => onSmartAssign(task)} className="smart-assign-btn" title="Smart Assign">🎯</button>

          <select 
            value={task.assignedUser?._id || ''} 
            onChange={e => onAssign(task, e.target.value)}
            className="assign-select"
            title="Assign to user">
            <option value="">👤 Assign to...</option>
            {users.map(u => <option key={u._id} value={u._id}>👤 {u.username}</option>)}
          </select>
        </div>
      </div>
      <div className="task-card-back">
        <div className="edit-form-group">
          <input 
            value={editData.title} 
            onChange={e => {
              setEditData({ ...editData, title: e.target.value });
              setValidationError('');
            }} 
            placeholder="Title" 
            className={validationError ? 'error' : ''}
          />
          {validationError && <span className="validation-error">{validationError}</span>}
        </div>
        <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} placeholder="Description" />
        <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select value={editData.priority} onChange={e => setEditData({ ...editData, priority: e.target.value })}>
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🔴 High</option>
        </select>
        <div className="task-edit-actions">
          <button onClick={handleSave} className="save-btn">💾 Save</button>
          <button onClick={handleCancel} className="cancel-btn">❌ Cancel</button>
        </div>
      </div>
    </div>
  );
});

export default TaskCard; 