import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('talenthub_token');
      const res = await fetch('/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setForm({
        avatar: data.avatar || '',
        bio: data.bio || '',
        portfolio: data.portfolio || '',
        resume: data.resume || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
      });
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('talenthub_token');
    const res = await fetch('/api/profile/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setProfile(data);
    setEditing(false);
    setSaving(false);
    setMessage('Profile updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!profile) return <p style={{ padding: 40 }}>Loading...</p>;

  const containerStyle = { maxWidth: 600, margin: '40px', padding: '0 20px' };
  const inputStyle = { width: '100%', padding: '10px 12px', marginBottom: 12, border: '1px solid #ccc', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' };
  const labelStyle = { fontSize: 13, color: '#666', marginBottom: 4, display: 'block' };
  const buttonStyle = { padding: '10px 20px', backgroundColor: '#2d2d2d', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer', marginRight: 10 };
  const outlineButtonStyle = { ...buttonStyle, backgroundColor: 'transparent', color: '#2d2d2d', border: '1px solid #2d2d2d' };

  return (
    <div style={containerStyle}>
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        <img
          src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username}&background=2d2d2d&color=fff&size=80`}
          alt="avatar"
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <h2 style={{ margin: 0 }}>{profile.username}</h2>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14, textTransform: 'capitalize' }}>{profile.role} · Member since {new Date(profile.memberSince).getFullYear()}</p>
        </div>
      </div>

      {message && <p style={{ color: 'green', marginBottom: 16 }}>{message}</p>}

      {!editing ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <span style={labelStyle}>Bio</span>
            <p style={{ margin: 0 }}>{profile.bio || <span style={{ color: '#aaa' }}>No bio yet</span>}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={labelStyle}>Portfolio</span>
            <p style={{ margin: 0 }}>{profile.portfolio ? <a href={profile.portfolio} target="_blank" rel="noreferrer">{profile.portfolio}</a> : <span style={{ color: '#aaa' }}>Not provided</span>}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={labelStyle}>Resume</span>
            <p style={{ margin: 0 }}>{profile.resume ? <a href={profile.resume} target="_blank" rel="noreferrer">{profile.resume}</a> : <span style={{ color: '#aaa' }}>Not provided</span>}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={labelStyle}>LinkedIn</span>
            <p style={{ margin: 0 }}>{profile.linkedin ? <a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin}</a> : <span style={{ color: '#aaa' }}>Not provided</span>}</p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <span style={labelStyle}>GitHub</span>
            <p style={{ margin: 0 }}>{profile.github ? <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a> : <span style={{ color: '#aaa' }}>Not provided</span>}</p>
          </div>
          <button style={buttonStyle} onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      ) : (
        <>
          <label style={labelStyle}>Avatar URL</label>
          <input name="avatar" placeholder="https://..." value={form.avatar} onChange={handleChange} style={inputStyle} />

          <label style={labelStyle}>Bio</label>
          <textarea name="bio" placeholder="Tell clients about yourself..." value={form.bio} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />

          <label style={labelStyle}>Portfolio URL</label>
          <input name="portfolio" placeholder="https://yourportfolio.com" value={form.portfolio} onChange={handleChange} style={inputStyle} />

          <label style={labelStyle}>Resume URL</label>
          <input name="resume" placeholder="https://drive.google.com/..." value={form.resume} onChange={handleChange} style={inputStyle} />

          <label style={labelStyle}>LinkedIn URL</label>
          <input name="linkedin" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={handleChange} style={inputStyle} />

          <label style={labelStyle}>GitHub URL</label>
          <input name="github" placeholder="https://github.com/..." value={form.github} onChange={handleChange} style={inputStyle} />

          <button style={buttonStyle} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          <button style={outlineButtonStyle} onClick={() => setEditing(false)}>Cancel</button>
        </>
      )}
    </div>
  );
}