import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { getApiUrl, getSocketUrl } from '../config/api';
import './ActivityLog.css';

const socket = io(getSocketUrl())

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/actions'), { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()

      //console.log(data)
      setLogs(data)
    } catch {
      setLogs([])
    }
    setLoading(false)
  }, [token])

  useEffect(() => { fetchLogs(); }, [fetchLogs])

   useEffect(() => {
    socket.on('refreshActions', fetchLogs)
    return () => {
       socket.off('refreshActions', fetchLogs); }
  },
   [fetchLogs])

  return (
    <div className="activitylog-container">
      <div className="activitylog-header">
        <Link to="/board" className="back-btn">
          ← Back to Board
        </Link>
        <h2 className="activitylog-title">
          📊 Activity Log</h2>

        <div className="activitylog-stats">

          <span className="log-count">{logs.length} Activities</span>
        </div>
       </div>
      
      <div className="activitylog-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading activities...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="activitylog-placeholder">
            <div className="placeholder-icon">📝</div>
            <h3>No activity yet</h3>
            <p>Start working on your board to see activities here!</p>
          </div>

        ) : (
          <div className="activitylog-list">
            {logs.map((log, i) => (
              <div className="activitylog-item" key={log._id || i} style={{ animationDelay: `${i * 0.05}s` }}>
                <div>
                <div className="log-main">
                  <span className="activitylog-user">{log.user?.username || 'Unknown'}</span>
                  <span className="activitylog-action">{log.action}</span>
                  {log.task?.title && <span className="activitylog-task">"{log.task.title}"</span>}
                </div>
                {log.details && <div className="activitylog-details">{log.details}
                  </div>}</div>
                <div className="activitylog-time">{new Date(log.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div> )}

      </div>
    </div>
  );
};

export default ActivityLog; 