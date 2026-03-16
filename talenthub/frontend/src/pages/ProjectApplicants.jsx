import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectApplications, updateApplicationStatus } from '../api';

const STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'];

export default function ProjectApplicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null); // ← selected application for modal

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
      // keep modal in sync
      if (selected?._id === appId) setSelected((prev) => ({ ...prev, status: updated.status }));
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
            <div
              key={app._id}
              className="applicant-card clickable"
              onClick={() => setSelected(app)}
            >
              <div className="applicant-avatar" />
              <div className="applicant-info">
                <strong>@{app.applicantId?.name || app.applicantId?.email}</strong>
                <div className="applicant-skills">
                  {(app.applicantId?.skills || []).map((s) => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
                {app.message && (
                  <p className="applicant-preview">{app.message.slice(0, 100)}{app.message.length > 100 ? '...' : ''}</p>
                )}
                <p className="app-date">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="applicant-actions" onClick={(e) => e.stopPropagation()}>
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

      {/* ── Application Detail Modal ── */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>

            <div className="modal-header">
              <div className="applicant-avatar large" />
              <div>
                <h2>@{selected.applicantId?.name || selected.applicantId?.email}</h2>
                <p className="app-date">Applied {new Date(selected.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Skills */}
            {(selected.applicantId?.skills?.length > 0) && (
              <div className="modal-section">
                <label>Skills</label>
                <div className="applicant-skills">
                  {selected.applicantId.skills.map((s) => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {selected.applicantId?.bio && (
              <div className="modal-section">
                <label>Bio</label>
                <p>{selected.applicantId.bio}</p>
              </div>
            )}

            {/* Cover Message */}
            {selected.message && (
              <div className="modal-section">
                <label>Cover Message</label>
                <p>{selected.message}</p>
              </div>
            )}

            {/* Portfolio */}
            {selected.portfolioUrl && (
              <div className="modal-section">
                <label>Portfolio</label>
                <a href={selected.portfolioUrl} target="_blank" rel="noreferrer">
                  {selected.portfolioUrl}
                </a>
              </div>
            )}

            {/* Availability */}
            {selected.availability && (
              <div className="modal-section">
                <label>Availability</label>
                <p>{selected.availability}</p>
              </div>
            )}

            {/* Proposed Rate */}
            {selected.rate && (
              <div className="modal-section">
                <label>Proposed Rate</label>
                <p>{selected.rate}</p>
              </div>
            )}

            {/* Status control inside modal too */}
            <div className="modal-section">
              <label>Application Status</label>
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected._id, e.target.value)}
                className={`status-select ${selected.status}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}