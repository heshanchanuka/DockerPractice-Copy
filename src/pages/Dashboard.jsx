import { useEffect, useState } from 'react';
import { countCourses, countStudents, countEnrollments } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ courses: 0, students: 0, enrollments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [c, s, e] = await Promise.all([
          countCourses(),
          countStudents(),
          countEnrollments(),
        ]);
        setStats({ courses: c.data, students: s.data, enrollments: e.data });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back! 👋</h1>
          <p>Here's what's happening in your learning platform today.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon purple">📚</div>
          <div className="stat-info">
            <h3>{stats.courses}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">👨‍🎓</div>
          <div className="stat-info">
            <h3>{stats.students}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📋</div>
          <div className="stat-info">
            <h3>{stats.enrollments}</h3>
            <p>Total Enrollments</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Quick Guide
        </h2>
        <ul style={{ color: 'var(--text-muted)', lineHeight: '2', paddingLeft: '18px' }}>
          <li>Go to <strong style={{ color: 'var(--primary-light)' }}>Courses</strong> to add, edit, or remove courses.</li>
          <li>Go to <strong style={{ color: 'var(--secondary)' }}>Students</strong> to manage student records.</li>
          <li>Go to <strong style={{ color: '#4ade80' }}>Enrollments</strong> to assign students to courses.</li>
        </ul>
      </div>
    </div>
  );
}
