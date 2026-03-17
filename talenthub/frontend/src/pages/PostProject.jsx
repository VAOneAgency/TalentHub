import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api';

const CATEGORIES = ['Design', 'Development', 'Marketing', 'Writing', 'Other'];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert'];

export default function PostProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    requiredSkills: [],
    budget: '',
    timeline: '',
    experienceLevel: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Tag-style skill addition — prevents empty strings from comma-split
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || formData.requiredSkills.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, requiredSkills: [...prev.requiredSkills, trimmed] }));
    setSkillInput('');
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createProject(formData);
      navigate('/my-listings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-project-page">
      <h1>Post a New Project</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="project-form">

        <label>
          Title *
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Landing page redesign for SaaS product"
            required
          />
        </label>

        <label>
          Description *
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the project scope, goals, and deliverables…"
            rows={5}
            required
          />
        </label>

        <label>
          Category *
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <div className="form-field">
          <label>Required Skills</label>
          <div className="skill-input-row">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter or Add"
            />
            <button type="button" className="btn-secondary" onClick={handleAddSkill}>
              Add
            </button>
          </div>
          {formData.requiredSkills.length > 0 && (
            <div className="skill-tags">
              {formData.requiredSkills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} aria-label={`Remove ${skill}`}>
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Budget is text to support ranges like "$500–$1,200" or "$65/hr" */}
        <label>
          Budget
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g. $500–$1,200 or $65/hr"
          />
        </label>

        <label>
          Timeline
          <input
            type="text"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="e.g. 2 weeks, 1 month"
          />
        </label>

        <label>
          Experience Level
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            // Not required — ProjectDetail renders this field conditionally
          >
            <option value="">Any level</option>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Posting...' : 'Post Project'}
        </button>
      </form>
    </div>
  );
}