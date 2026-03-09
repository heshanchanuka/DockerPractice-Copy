import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const titles = {
    '/': 'Dashboard',
    '/courses': 'Courses',
    '/students': 'Students',
    '/enrollments': 'Enrollments',
  };

  const title = titles[location.pathname] || 'LMS';

  return (
    <header className="navbar">
      <span className="navbar-title">{title}</span>
      <span className="navbar-subtitle">Learning Management System</span>
    </header>
  );
}
