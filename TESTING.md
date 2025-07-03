# 🧪 Testing Guide for Trello Clone

This guide walks you through testing all the unique features and requirements of the Trello clone application.

## 🚀 Quick Start Testing

1. **Start the application**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

2. **Open multiple browser tabs/windows** to test real-time collaboration features.

## 🔐 Authentication Testing

### User Registration & Login
1. **Register new users**:
   - Go to `/register`
   - Create multiple test users (e.g., `john@test.com`, `jane@test.com`)
   - Verify password hashing (passwords should be stored as hashes in MongoDB)

2. **Login/Logout**:
   - Test login with valid credentials
   - Test login with invalid credentials
   - Verify JWT token storage in localStorage
   - Test automatic logout when token expires

## 📋 Task Management Testing

### Creating Tasks
1. **Valid task creation**:
   - Create task with unique title ✅
   - Verify task appears in "Todo" column
   - Check different priority levels (Low, Medium, High)

2. **Validation testing**:
   - Try creating task with duplicate title ❌ (should show error)
   - Try creating task with column name as title ❌:
     - "Todo" ❌
     - "In Progress" ❌
     - "Done" ❌
   - Create task with empty title ❌ (should show error)

### Editing Tasks
1. **Card flip animation**:
   - Click "Edit" button (✏️)
   - Verify smooth 3D flip animation
   - Edit task details and save
   - Test cancel functionality

2. **Validation during edit**:
   - Try changing title to duplicate name ❌
   - Try changing title to column name ❌
   - Verify real-time validation feedback

### Deleting Tasks
1. **Delete confirmation**:
   - Click delete button (🗑️)
   - Verify confirmation dialog appears
   - Test both "OK" and "Cancel" options

## 🎯 Drag and Drop Testing

### Basic Drag and Drop
1. **Move tasks between columns**:
   - Drag task from "Todo" to "In Progress"
   - Drag task from "In Progress" to "Done"
   - Verify smooth animations during drag
   - Check task count updates in column headers

2. **Visual feedback**:
   - Verify dragging card scales up and shows shadow
   - Check drop zone highlighting when hovering over columns
   - Test dropping outside valid areas (should return to original position)

### Multi-user Drag Testing
1. **Open in multiple tabs**:
   - Login with different users in each tab
   - Drag tasks in one tab
   - Verify other tabs update immediately ⚡

## 🎯 Smart Assignment Testing

### Setup for Smart Assignment
1. **Create test scenario**:
   - User A: 0 active tasks
   - User B: 2 active tasks (not in "Done")
   - User C: 1 active task

2. **Test smart assignment**:
   - Click "Smart Assign" button (🎯) on an unassigned task
   - Verify task gets assigned to User A (fewest active tasks)
   - Create more tasks and test load balancing

3. **Edge cases**:
   - Test with no users available
   - Test with all users having equal task loads
   - Test with tasks in "Done" status (should not count toward active tasks)

## ⚔️ Conflict Resolution Testing

### Creating Conflicts
1. **Setup conflict scenario**:
   - Open same task for editing in two browser tabs
   - Login with different users in each tab
   - Edit the SAME task simultaneously

2. **Conflict detection**:
   - Edit task title in Tab 1, don't save yet
   - Edit task description in Tab 2, save first
   - Now save from Tab 1
   - Verify conflict modal appears ⚠️

3. **Conflict resolution**:
   - **Keep My Changes**: Should overwrite server version
   - **Keep Server Version**: Should accept remote changes
   - **Cancel**: Should dismiss modal without changes

### Real-time Conflict Prevention
1. **Optimistic updates**:
   - Drag task in one tab
   - Verify immediate UI update (optimistic)
   - Check other tabs update via WebSockets

## 🌐 Real-time Synchronization Testing

### WebSocket Testing
1. **Multi-tab setup**:
   - Open 3+ browser tabs with different users
   - Perform actions in one tab:
     - Create task
     - Edit task
     - Delete task
     - Move task between columns
     - Assign/reassign task

2. **Verify real-time updates**:
   - All other tabs should update within 1-2 seconds
   - No page refresh required
   - UI should be smooth and responsive

### Connection Testing
1. **Network interruption simulation**:
   - Disable network temporarily
   - Make changes (should queue)
   - Re-enable network
   - Verify changes sync properly

## 📝 Activity Log Testing

### Action Logging
1. **Test logged actions**:
   - Create task → Check activity log
   - Edit task → Verify "update" action logged
   - Delete task → Verify "delete" action logged
   - Smart assign → Check "smart_assign" action
   - Manual assign → Check "assign" action

2. **Activity log display**:
   - Go to Activity Log page (`/activity`)
   - Verify last 20 actions shown
   - Check timestamp formatting
   - Verify user attribution

### Real-time Activity Updates
1. **Multi-user activity**:
   - Perform actions in multiple tabs
   - Verify activity log updates live
   - Check proper user attribution for each action

## 📱 Responsive Design Testing

### Desktop Testing (1200px+)
- Verify 3-column layout
- Check task card sizing
- Test drag and drop smoothness
- Verify all buttons accessible

### Tablet Testing (768px - 1199px)
- Check responsive column layout
- Verify touch interactions work
- Test form responsiveness
- Check modal sizing

### Mobile Testing (320px - 767px)
- Verify single-column layout
- Test touch drag and drop
- Check button sizing for touch
- Verify form stacking
- Test modal responsiveness

## 🎨 Animation & UI Testing

### Custom Animations
1. **Card flip animation**:
   - Smooth 3D rotation when editing
   - Consistent timing and easing
   - No glitches or jumps

2. **Drag animations**:
   - Scaling effect during drag
   - Shadow depth changes
   - Smooth return to position

3. **Loading animations**:
   - Spinner during data fetching
   - Smooth fade-in for content
   - Progress indicators

### Visual Polish
1. **Hover effects**:
   - Button hover states
   - Card hover elevation
   - Interactive feedback

2. **Color scheme**:
   - Consistent color palette
   - High contrast for accessibility
   - Priority color coding (🟢🟡🔴)

## 🚨 Error Handling Testing

### Network Error Testing
1. **Offline scenarios**:
   - Disconnect network
   - Attempt operations
   - Verify error messages
   - Test reconnection behavior

2. **Server error simulation**:
   - Stop backend server
   - Attempt frontend operations
   - Verify graceful error handling
   - Check user feedback

### Validation Error Testing
1. **Form validation**:
   - Submit empty forms
   - Submit invalid data
   - Check real-time validation feedback
   - Verify error message clarity

## 📊 Performance Testing

### Load Testing
1. **Large dataset**:
   - Create 50+ tasks
   - Test drag performance
   - Check rendering speed
   - Verify memory usage

2. **Concurrent users**:
   - Simulate multiple users
   - Test WebSocket performance
   - Check conflict handling under load

## ✅ Test Checklist

Print this checklist and check off each item as you test:

### Basic Functionality
- [ ] User registration works
- [ ] User login/logout works
- [ ] Task creation works
- [ ] Task editing works
- [ ] Task deletion works
- [ ] Drag and drop works
- [ ] Task assignment works

### Unique Features
- [ ] Smart assignment logic works correctly
- [ ] Conflict detection triggers properly
- [ ] Conflict resolution modal appears
- [ ] Title validation prevents duplicates
- [ ] Title validation prevents column names
- [ ] Real-time updates work across tabs
- [ ] Activity logging captures all actions

### UI/UX
- [ ] Card flip animation is smooth
- [ ] Drag animations work properly
- [ ] Loading states display correctly
- [ ] Error messages are clear
- [ ] Success messages appear
- [ ] Responsive design works on all screen sizes

### Advanced Features
- [ ] WebSocket connection is stable
- [ ] Optimistic updates work
- [ ] Conflict resolution preserves data
- [ ] Smart assignment balances load
- [ ] Activity log updates in real-time

## 🐛 Common Issues & Solutions

1. **WebSocket not connecting**:
   - Check backend server is running
   - Verify port 5000 is accessible
   - Check console for connection errors

2. **Drag and drop not working**:
   - Check react-beautiful-dnd is installed
   - Verify draggableId is unique
   - Check console for React warnings

3. **Conflicts not detecting**:
   - Verify updatedAt timestamps are being sent
   - Check backend conflict logic
   - Test with actual time delays

4. **Real-time updates delayed**:
   - Check WebSocket connection status
   - Verify socket.emit calls in backend
   - Check network tab for WebSocket frames

Remember to test in different browsers (Chrome, Firefox, Safari, Edge) to ensure cross-browser compatibility!
