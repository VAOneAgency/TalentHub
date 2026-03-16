import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, applyToProject } from '../api';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portfolioUrl, setPortfolioUrl] = useState('');
const [availability, setAvailability] = useState('');
const [rate, setRate] = useState('');
  const [error, setError] = useState('');

  // Application form
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  // Get current user from localStorage (set by partner's auth)
  const user = JSON.parse(localStorage.getItem('talenthub_user') || 'null');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');
    setApplySuccess('');
    try {
      await applyToProject({ projectId: id, message, portfolioUrl, availability, rate });
      setApplySuccess('Application submitted! You can track it from your dashboard.');
      setMessage('');
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading">Loading project...</div>;
  if (error) return <p className="error">{error}</p>;
  if (!project) return null;

  const isOwner = user && project.postedBy?._id === user.id;
  const isFreelancer = user?.role === 'freelancer';
  const postedDate = new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="detail-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/projects">Browse</Link> / {project.title}
      </nav>

      <div className="detail-layout">
        {/* ── Left: Project Info ── */}
        <div className="detail-main">
          <div className="detail-status-row">
            <span className={`status-badge ${project.status}`}>{project.status}</span>
            <span className="posted-at">Posted {postedDate}</span>
          </div>

          <h1 className="detail-title">{project.title}</h1>

          <div className="detail-meta">
            <span>Posted by <strong>@{project.postedBy?.username || project.postedBy?.email}</strong></span>
            <span className="dot">·</span>
            <span>Client</span>
          </div>

          <div className="detail-skills">
            {project.requiredSkills.map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>

          <section className="detail-section">
            <h3>Project Description</h3>
            <p>{project.description}</p>
          </section>

          {isOwner && (
            <div className="owner-actions">
              <button onClick={() => navigate(`/projects/${id}/edit`)} className="btn-secondary">Edit Project</button>
            </div>
          )}
        </div>

        {/* ── Right: Sidebar ── */}
        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <h4>PROJECT INFO</h4>
            <div className="info-grid">
              <div>
                <label>Budget</label>
                <strong>{project.budget || '—'}</strong>
              </div>
              <div>
                <label>Duration</label>
                <strong>{project.timeline || '—'}</strong>
              </div>
              <div>
                <label>Applicants</label>
                <strong>{project.applicationCount ?? 0} applied</strong>
              </div>
              <div>
                <label>Category</label>
                <strong>{project.category}</strong>
              </div>
              {project.experienceLevel && (
                <div>
                  <label>Experience</label>
                  <strong>{project.experienceLevel}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Apply form — shown only to freelancers when project is open */}
          {isFreelancer && project.status === 'open' && (
            <div className="sidebar-card apply-card">
              <h4>SUBMIT APPLICATION</h4>
              {applySuccess ? (
                <p className="success-msg">{applySuccess}</p>
              ) : (
                <form onSubmit={handleApply}>
  <label className="form-label">Why are you the right fit? *</label>
  <textarea
    placeholder="Tell the client about your relevant experience..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    rows={4}
    required
  />

  <label className="form-label">Portfolio / Work Samples URL</label>
  <input
    type="url"
    placeholder="https://your-portfolio.com"
    value={portfolioUrl}
    onChange={(e) => setPortfolioUrl(e.target.value)}
  />

  <label className="form-label">Availability</label>
  <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
    <option value="">Select availability...</option>
    <option value="immediately">Immediately</option>
    <option value="1-2 weeks">1–2 weeks</option>
    <option value="1 month">1 month</option>
    <option value="negotiable">Negotiable</option>
  </select>

  <label className="form-label">Proposed Rate (optional)</label>
  <input
    type="text"
    placeholder="e.g. $50/hr or $1,200 flat"
    value={rate}
    onChange={(e) => setRate(e.target.value)}
  />

  {applyError && <p className="error">{applyError}</p>}
  <button type="submit" className="btn-primary" disabled={applying || !message}>
    {applying ? 'Submitting...' : 'Apply Now →'}
  </button>
  <p className="withdraw-note">Withdraw anytime from your dashboard</p>
</form>
              )}
            </div>
          )}

          {/* Client: link to applicants */}
          {isOwner && (
            <div className="sidebar-card">
              <h4>APPLICANTS</h4>
              <Link to={`/projects/${id}/applicants`} className="btn-secondary full-width">
                View Applicants ({project.applicationCount ?? 0})
              </Link>
            </div>
          )}

          <div className="sidebar-card">
            <h4>ABOUT THE CLIENT</h4>
            <div className="client-info">
              <div className="avatar" />
              <div>
                <strong>@{project.postedBy?.username || project.postedBy?.email}</strong>
                <p>Member since {new Date(project.postedBy?.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}