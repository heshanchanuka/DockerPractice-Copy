import { useState, useEffect } from 'react';
import { getEnrollments, deleteEnrollment } from '../../services/api';
import EnrollmentForm from './EnrollmentForm';

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await getEnrollments();
      setEnrollments(res.data);
    } catch {
      setError('Failed to load enrollments. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnrollments(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this enrollment?')) return;
    try {
      await deleteEnrollment(id);
      fetchEnrollments();
    } catch {
      setError('Failed to remove enrollment.');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    fetchEnrollments();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>📋 Enrollments</h1>
          <p>Manage which students are enrolled in which courses</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Enroll Student
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : enrollments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No enrollments yet</h3>
            <p>Click "Enroll Student" to assign a student to a course.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Enrolled On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment, i) => (
                  <tr key={enrollment.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{enrollment.student?.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {enrollment.student?.email}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{enrollment.course?.title}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{enrollment.course?.instructor}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {enrollment.enrolledAt
                        ? new Date(enrollment.enrolledAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(enrollment.id)}
                      >
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && <EnrollmentForm onClose={handleFormClose} />}
    </div>
  );
}
