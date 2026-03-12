import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications, withdrawApplication } from '../api';

const STATUS_COLORS = {
  pending: '#b4860a',
  reviewed: '#1a73e8',
  accepted: '#1a7a40',
  rejected: '#b0302a',
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await withdrawApplication(appId);
      setApplications((prev) => prev.filter((a) => a._id !== appId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;

  return (
    <div className="my-apps-page">
      <h1>My Applications</h1>
      {error && <p className="error">{error}</p>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>You haven't applied to any projects yet.</p>
          <Link to="/projects" className="btn-primary">Browse Projects</Link>
        </div>
      ) : (
        <div className="app-list">
          {applications.map((app) => (
            <div key={app._id} className="app-card">
              <div className="app-card-left">
                <Link to={`/projects/${app.projectId?._id}`} className="app-title">
                  {app.projectId?.title || 'Project removed'}
                </Link>
                <div className="app-meta">
                  <span>{app.projectId?.category}</span>
                  <span className="dot">·</span>
                  <span>{app.projectId?.budget || 'Budget TBD'}</span>
                  <span className="dot">·</span>
                  <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                {app.message && <p className="app-message">"{app.message.slice(0, 120)}..."</p>}
              </div>
              <div className="app-card-right">
                <span
                  className="status-pill"
                  style={{ color: STATUS_COLORS[app.status] }}
                >
                  {app.status}
                </span>
                {app.status === 'pending' && (
                  <button
                    className="btn-danger-sm"
                    onClick={() => handleWithdraw(app._id)}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}