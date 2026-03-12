import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyProjects, deleteProject } from '../api';

export default function MyListings() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getMyProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? All applications will also be removed.')) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading your projects...</div>;

  return (
    <div className="my-listings-page">
      <div className="page-header">
        <h1>My Projects</h1>
        <Link to="/projects/new" className="btn-primary">+ Post New Project</Link>
      </div>

      {error && <p className="error">{error}</p>}

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>You haven't posted any projects yet.</p>
          <Link to="/projects/new" className="btn-primary">Post Your First Project</Link>
        </div>
      ) : (
        <div className="listings-table">
          <div className="table-header">
            <span>Project</span>
            <span>Status</span>
            <span>Applicants</span>
            <span>Posted</span>
            <span>Actions</span>
          </div>
          {projects.map((project) => (
            <div key={project._id} className="table-row">
              <div className="table-title">
                <Link to={`/projects/${project._id}`}>{project.title}</Link>
                <span className="table-category">{project.category}</span>
              </div>
              <span className={`status-badge ${project.status}`}>{project.status}</span>
              <span>{project.applicationCount ?? 0} applied</span>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              <div className="table-actions">
                <button className="btn-sm" onClick={() => navigate(`/projects/${project._id}/edit`)}>Edit</button>
                <Link to={`/projects/${project._id}/applicants`} className="btn-sm">View Apps</Link>
                <button className="btn-sm btn-danger" onClick={() => handleDelete(project._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}