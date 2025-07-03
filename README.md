# 🚀 Trello Clone - Advanced Kanban Board

A full-stack Trello clone with real-time collaboration, drag-and-drop functionality, and advanced conflict resolution. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

### Frontend (React)
- **🎯 Kanban Board**: Three columns (Todo, In Progress, Done) with drag-and-drop functionality
- **🔄 Real-time Sync**: Live updates using WebSockets when other users make changes
- **⚡ Smart Assign**: Automatically assigns tasks to the user with the fewest active tasks
- **🛡️ Conflict Resolution**: Detects and resolves conflicts when multiple users edit the same task
- **✅ Validation**: Ensures task titles are unique and don't match column names
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Custom Animations**: Smooth card flip animations and drag-and-drop effects
- **🎭 No External UI Libraries**: 100% custom CSS styling

### Backend (Node.js/Express)
- **🔐 JWT Authentication**: Secure login/register system with hashed passwords
- **📊 Task Management**: Full CRUD operations with validation
- **📝 Action Logging**: Tracks all user actions with timestamps
- **🌐 Real-time Updates**: WebSocket integration for live collaboration
- **⚔️ Conflict Detection**: Optimistic concurrency control using timestamps
- **🎯 Smart Assignment Logic**: Custom algorithm to balance workload

## 🛠️ Technology Stack

- **Frontend**: React 18, Custom CSS, Socket.IO Client, React Beautiful DnD
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- **Authentication**: JWT, bcryptjs
- **Real-time**: Socket.IO
- **Validation**: Custom validation logic

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trello-clone
JWT_SECRET=your-super-secret-jwt-key
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/users` - Get all users (authenticated)

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/smart-assign` - Smart assign task

### Activity Log
- `GET /api/actions` - Get last 20 actions

## 🎯 Key Features Explained

### Smart Assignment Algorithm
When you click "Smart Assign" on a task, the system:
1. Counts active tasks (not in "Done" status) for each user
2. Assigns the task to the user with the fewest active tasks
3. Logs the action for audit trail

### Conflict Resolution
The system handles conflicts when multiple users edit the same task:
1. Uses optimistic concurrency control with `updatedAt` timestamps
2. Detects conflicts when timestamps don't match
3. Shows both versions to the user
4. Allows user to choose: keep their changes or accept server version

### Real-time Synchronization
- Uses WebSockets to broadcast changes to all connected users
- Prevents unnecessary re-fetches during drag operations
- Updates UI optimistically for better user experience

### Validation Rules
- Task titles must be unique across the board
- Task titles cannot match column names ("Todo", "In Progress", "Done")
- Real-time validation feedback during editing

## 🎨 UI/UX Features

### Custom Animations
- **Card Flip**: Tasks flip with a 3D animation when editing
- **Drag Effects**: Smooth scaling and shadow effects during drag
- **Loading States**: Spinner animations for better feedback
- **Hover Effects**: Interactive button and card hover states

### Responsive Design
- **Desktop**: Multi-column layout with optimal spacing
- **Tablet**: Responsive columns that stack on smaller screens
- **Mobile**: Single-column layout with touch-friendly controls

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly labels
- High contrast color scheme

## 🔧 Development

### Project Structure
```
trello-clone/
├── backend/
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── sockets/        # WebSocket handlers
│   └── server.js       # Main server file
└── frontend/
    ├── public/         # Static assets
    └── src/
        ├── components/ # Reusable components
        ├── pages/      # Main pages
        ├── utils/      # Utility functions
        └── App.js      # Main app component
```

### Environment Variables

**Backend (.env)**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trello-clone
JWT_SECRET=your-jwt-secret-key
```

## 🧪 Testing

### Manual Testing Scenarios

1. **Multi-user Collaboration**:
   - Open app in multiple browser tabs
   - Login with different users
   - Make changes and observe real-time updates

2. **Conflict Resolution**:
   - Edit same task in two tabs simultaneously
   - Save from both tabs to trigger conflict modal

3. **Smart Assignment**:
   - Create users with different task loads
   - Use smart assign to verify load balancing

4. **Validation**:
   - Try creating tasks with duplicate titles
   - Try using column names as task titles

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy the backend directory

### Frontend Deployment (Netlify/Vercel)
1. Update API URLs to point to your deployed backend
2. Build the project: `npm run build`
3. Deploy the build directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

If you have any questions or run into issues, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React, Node.js, and modern web technologies.
