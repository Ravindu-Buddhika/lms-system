import React from 'react';
import HealthStatus from './components/HealthStatus';
import RoleCard from './components/RoleCard';
import './index.css';

const ROLES_INFO = [
  {
    title: 'Super Admin',
    badgeText: 'System Owned',
    badgeVariant: 'danger',
    description: 'Full access to the entire system. Can create and delete Admin accounts.',
    boundary: 'Cannot be edited, disabled, or deleted by anyone (including other Super Admins).',
  },
  {
    title: 'Admin',
    badgeText: 'Management',
    badgeVariant: 'warning',
    description: 'Manages system content, Teachers, and Students. Can block/unblock content.',
    boundary: 'Cannot create, edit, disable, or delete ANY Admin account. Backend enforced.',
  },
  {
    title: 'Teacher',
    badgeText: 'Educator',
    badgeVariant: 'info',
    description: 'Can upload and manage their own courses only. Views active student enrollment.',
    boundary: 'Requires an approved Teacher Application before role is granted.',
  },
  {
    title: 'Student',
    badgeText: 'Default Role',
    badgeVariant: 'success',
    description: 'Default role upon registration. Can browse courses, enroll, and view learning dashboard.',
    boundary: 'Course progress and enrollment status are tracked independently per course.',
  },
];

export function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-badge">LMS Architecture Scaffold</div>
        <h1>Learning Management System</h1>
        <p className="subtitle">React Frontend &amp; Node.js Backend with strict permission boundaries</p>
      </header>

      <main className="app-main">
        <HealthStatus />

        <section className="roles-section">
          <h2>Core System Roles &amp; Permission Boundaries</h2>
          <div className="roles-grid">
            {ROLES_INFO.map((role) => (
              <RoleCard
                key={role.title}
                title={role.title}
                badgeText={role.badgeText}
                badgeVariant={role.badgeVariant}
                description={role.description}
                boundary={role.boundary}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Phase 0: Scaffolded with React &amp; Vite</p>
      </footer>
    </div>
  );
}

export default App;
