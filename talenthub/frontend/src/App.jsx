import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BrowseProjects from './pages/BrowseProjects';
import ProjectDetail from './pages/ProjectDetail';
import ProjectForm from './pages/ProjectForm';
import MyApplications from './pages/MyApplications';
import ProjectApplicants from './pages/ProjectApplicants';
import MyListings from './pages/MyListings';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import './styles.css';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public */}
          <Route path="/projects" element={<BrowseProjects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />

          {/* Any logged in user */}
          <Route path="/projects/new" element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          } />
          <Route path="/projects/:id/edit" element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          } />

          {/* Freelancer only */}
          <Route path="/my-applications" element={
            <ProtectedRoute allowedRoles={['freelancer']}>
              <MyApplications />
            </ProtectedRoute>
          } />

          {/* Client only */}
          <Route path="/my-listings" element={
            <ProtectedRoute allowedRoles={['client']}>
              <MyListings />
            </ProtectedRoute>
          } />
          <Route path="/projects/:id/applicants" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ProjectApplicants />
            </ProtectedRoute>
          } />

          {/* Any logged in user */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/projects" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}