import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BrowseProjects from './pages/BrowseProjects';
import ProjectDetail from './pages/ProjectDetail';
import ProjectForm from './pages/ProjectForm';
import MyApplications from './pages/MyApplications';
import ProjectApplicants from './pages/ProjectApplicants';
import MyListings from './pages/MyListings';
import './styles.css';

/**
 * Routes owned by this feature (Project Listings & Applications).
 *
 * Partner's routes (Auth & Dashboard) should be added at the top level
 * alongside these — do NOT modify this file's existing routes.
 *
 * Expected partner routes (for reference only):
 *   /login, /register, /dashboard
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/projects" element={<BrowseProjects />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<ProjectForm />} />
        <Route path="/projects/:id/applicants" element={<ProjectApplicants />} />

        {/* Freelancer */}
        <Route path="/my-applications" element={<MyApplications />} />

        {/* Client */}
        <Route path="/my-listings" element={<MyListings />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}