import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectApplications, updateApplicationStatus } from '../api';

const STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'];

export default function ProjectApplicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProjectApplications(id)
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (appId, status) => {
    try {
      const updated = await updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: updated.status } : a))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading applicants...</div>;

  return (
    <div className="applicants-page">
      <div className="page-header">
        <Link to={`/projects/${id}`} className="back-link">← Back to Project</Link>
        <h1>Applicants</h1>
        <p>{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
      </div>

      {error && <p className="error">{error}</p>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>No applications yet. Share your project to attract freelancers!</p>
        </div>
      ) : (
        <div className="applicant-list">
          {applications.map((app) => (
            <div key={app._id} className="applicant-card">
              <div className="applicant-avatar" />
              <div className="applicant-info">
                <strong>@{app.applicantId?.name || app.applicantId?.email}</strong>
                <div className="applicant-skills">
                  {(app.applicantId?.skills || []).map((s) => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
                {app.applicantId?.bio && <p className="applicant-bio">{app.applicantId.bio}</p>}
                {app.message && (
                  <div className="applicant-message">
                    <label>Cover Message</label>
                    <p>{app.message}</p>
                  </div>
                )}
                <p className="app-date">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="applicant-actions">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className={`status-select ${app.status}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}