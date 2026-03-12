import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api';

const CATEGORIES = ['All', 'Design', 'Development', 'Marketing', 'Writing', 'Other'];

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      const data = await getProjects(params);
      setProjects(data.projects);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>Browse Projects</h1>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab ${category === cat || (cat === 'All' && !category) ? 'active' : ''}`}
            onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <>
          <div className="projects-grid">
            {projects.length === 0 ? (
              <p className="empty">No projects found.</p>
            ) : (
              projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span>Page {page} of {pagination.pages}</span>
              <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`} className="project-card">
      <div className="card-top">
        <span className={`status-badge ${project.status}`}>{project.status}</span>
        <span className="category-tag">{project.category}</span>
      </div>
      <h2 className="card-title">{project.title}</h2>
      <p className="card-desc">{project.description.slice(0, 120)}...</p>
      <div className="card-skills">
        {project.requiredSkills.slice(0, 3).map((skill) => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>
      <div className="card-footer">
        <span className="budget">{project.budget || 'Budget TBD'}</span>
        <span className="applicants">{project.applicationCount ?? 0} applied</span>
      </div>
    </Link>
  );
}