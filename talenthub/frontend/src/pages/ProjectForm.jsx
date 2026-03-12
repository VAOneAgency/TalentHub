import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProject, updateProject, getProjectById } from '../api';

const CATEGORIES = ['Design', 'Development', 'Marketing', 'Writing', 'Other'];
const TIMELINES = ['Less than 1 week', '1–2 weeks', '2–4 weeks', '1–3 months', '3+ months'];
const EXPERIENCE = ['', 'Entry Level', 'Mid Level', 'Senior Level'];

export default function ProjectForm() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    category: 'Design',
    timeline: '1–2 weeks',
    experienceLevel: 'Mid Level',
    status: 'open',
    skillInput: '',
    requiredSkills: [],
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getProjectById(id)
      .then((p) => {
        setForm({
          title: p.title,
          description: p.description,
          budget: p.budget || '',
          category: p.category || 'Design',
          timeline: p.timeline || '1–2 weeks',
          experienceLevel: p.experienceLevel || '',
          status: p.status,
          skillInput: '',
          requiredSkills: p.requiredSkills || [],
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addSkills = () => {
    const news = form.skillInput.split(',').map((s) => s.trim()).filter(Boolean);
    const merged = [...new Set([...form.requiredSkills, ...news])];
    setForm((f) => ({ ...f, requiredSkills: merged, skillInput: '' }));
  };

  const removeSkill = (skill) => {
    setForm((f) => ({ ...f, requiredSkills: f.requiredSkills.filter((s) => s !== skill) }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkills(); }
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        budget: form.budget,
        category: form.category,
        timeline: form.timeline,
        experienceLevel: form.experienceLevel,
        requiredSkills: form.requiredSkills,
        status: status || form.status,
      };
      if (isEdit) {
        await updateProject(id, payload);
        navigate(`/projects/${id}`);
      } else {
        const project = await createProject(payload);
        navigate(`/projects/${project._id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading project...</div>;

  return (
    <div className="form-page">
      <div className="form-header-bar">
        <span className="client-view-tag">Client View</span>
        <h1>{isEdit ? 'Edit Project' : 'Post a New Project'}</h1>
        <p>{isEdit ? 'Update your project details.' : 'Fill in the details below to start receiving applications.'}</p>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="project-form">
        {/* Project Basics */}
        <fieldset>
          <legend>PROJECT BASICS</legend>
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              placeholder="e.g. React Developer for E-commerce App"
              value={form.title}
              onChange={set('title')}
              required
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="Describe the project, deliverables, and what you're looking for..."
              value={form.description}
              onChange={set('description')}
              rows={5}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Budget (USD)</label>
              <input type="text" placeholder="e.g. $500" value={form.budget} onChange={set('budget')} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Required Skills */}
        <fieldset>
          <legend>REQUIRED SKILLS</legend>
          <div className="form-group">
            <label>Add Skills (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Figma, MongoDB"
              value={form.skillInput}
              onChange={set('skillInput')}
              onBlur={addSkills}
              onKeyDown={handleSkillKeyDown}
            />
          </div>
          <div className="skill-tags">
            {form.requiredSkills.map((s) => (
              <span key={s} className="skill-tag removable">
                {s} <button type="button" onClick={() => removeSkill(s)}>×</button>
              </span>
            ))}
          </div>
        </fieldset>

        {/* Additional Details */}
        <fieldset>
          <legend>ADDITIONAL DETAILS</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Timeline</label>
              <select value={form.timeline} onChange={set('timeline')}>
                {TIMELINES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select value={form.experienceLevel} onChange={set('experienceLevel')}>
                {EXPERIENCE.map((e) => <option key={e} value={e}>{e || 'Any'}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={saving}
          >
            Save Draft
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes →' : 'Publish Project →'}
          </button>
        </div>
      </form>
    </div>
  );
}