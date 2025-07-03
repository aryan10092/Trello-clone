const Task = require('../models/Task');
const User = require('../models/User');
const ActionLog = require('../models/ActionLog');

// Helper: log action
async function logAction(userId, action, taskId, details) {
  await ActionLog.create({ user: userId, action, task: taskId, details });
}

exports.getTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedUser', 'username email');
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedUser, status, priority } = req.body;
    // Title validation: unique per board, not column names
    const forbiddenTitles = ['Todo', 'In Progress', 'Done'];
    if (forbiddenTitles.includes(title)) {
      return res.status(400).json({ message: 'Task title cannot match column names.' });
    }
    const exists = await Task.findOne({ title });
    if (exists) {
      return res.status(400).json({ message: 'Task title must be unique.' });
    }
    const task = await Task.create({ title, description, assignedUser, status, priority });
    await logAction(req.user.id, 'create', task._id, 'Created task');
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    // Conflict handling: check updatedAt
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    if (update.updatedAt && new Date(update.updatedAt).getTime() !== new Date(task.updatedAt).getTime()) {
      // Conflict detected
      return res.status(409).json({ message: 'Conflict detected.', serverTask: task });
    }
    Object.assign(task, update);
    await task.save();
    await logAction(req.user.id, 'update', task._id, 'Updated task');
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    await logAction(req.user.id, 'delete', id, 'Deleted task');
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.smartAssign = async (req, res) => {
  try {
    // Find user with fewest active (not Done) tasks
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    let minUser = null;
    let minCount = Infinity;
    const userTaskCounts = [];
    
    // Check each user's active task count
    for (const user of users) {
      const count = await Task.countDocuments({ 
        assignedUser: user._id, 
        status: { $ne: 'Done' } 
      });
      
      userTaskCounts.push({
        username: user.username,
        userId: user._id,
        activeTasks: count
      });
      
      console.log(`User ${user.username} has ${count} active tasks`);
      
      if (count < minCount) {
        minCount = count;
        minUser = user;
      }
    }
    
    if (!minUser) {
      return res.status(404).json({ message: 'No users available for assignment.' });
    }

    // Assign task
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.assignedUser = minUser._id;
    await task.save();
    
    // Populate the assignedUser field before returning
    await task.populate('assignedUser', 'username email');
    
    await logAction(req.user.id, 'smart_assign', task._id, `Smart assigned to ${minUser.username}`);
    
    console.log(`Task "${task.title}" smart assigned to ${minUser.username} (${minCount} active tasks)`);
    console.log('User task counts:', userTaskCounts);
    
    res.json(task);
  } catch (err) {
    console.error('Smart assign error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Debug endpoint to check user task counts
exports.getUserTaskCounts = async (req, res) => {
  try {
    const users = await User.find();
    const userTaskCounts = [];
    
    for (const user of users) {
      const totalTasks = await Task.countDocuments({ assignedUser: user._id });
      const activeTasks = await Task.countDocuments({ 
        assignedUser: user._id, 
        status: { $ne: 'Done' } 
      });
      const doneTasks = await Task.countDocuments({ 
        assignedUser: user._id, 
        status: 'Done' 
      });
      
      userTaskCounts.push({
        username: user.username,
        userId: user._id,
        totalTasks,
        activeTasks,
        doneTasks
      });
    }
    
    res.json(userTaskCounts);
  } catch (err) {
    console.error('Get user task counts error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}; 