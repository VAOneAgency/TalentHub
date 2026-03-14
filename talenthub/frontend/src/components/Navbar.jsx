import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 32px',
    backgroundColor: '#2d2d2d',
    color: '#fff',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: 14,
    marginLeft: 20,
  };

  const buttonStyle = {
    marginLeft: 20,
    padding: '7px 16px',
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
  };

  return (
    <nav style={navStyle}>
      {/* Left — logo */}
      <Link to="/projects" style={{ ...linkStyle, fontSize: 18, fontWeight: 700, marginLeft: 0 }}>
        TalentHub
      </Link>

      {/* Right — links */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/projects" style={linkStyle}>Browse Projects</Link>

        {user && user.role === 'client' && (
          <>
            <Link to="/my-listings" style={linkStyle}>My Listings</Link>
            <Link to="/projects/new" style={linkStyle}>Post a Project</Link>
          </>
        )}

        {user && user.role === 'freelancer' && (
          <Link to="/my-applications" style={linkStyle}>My Applications</Link>
        )}

        {!user ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{ ...linkStyle, padding: '7px 16px', backgroundColor: '#fff', color: '#2d2d2d', borderRadius: 6, fontWeight: 600 }}>
              Register
            </Link>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ ...linkStyle, color: '#ccc' }}>Hi, {user.username}</span>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}