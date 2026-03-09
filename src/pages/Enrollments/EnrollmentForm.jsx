import { useState, useEffect } from 'react';
import { getCourses, getStudents, createEnrollment } from '../../services/api';

export default function EnrollmentForm({ onClose }) {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, s] = await Promise.all([getCourses(), getStudents()]);
        setCourses(c.data);
        setStudents(s.data);
      } catch {
        setError('Failed to load courses or students.');
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !studentId) {
      setError('Please select both a course and a student.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createEnrollment(Number(courseId), Number(studentId));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll. Student may already be enrolled in this course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>📋 Enroll Student in Course</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {dataLoading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Student *</label>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                <option value="">— Choose a student —</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Course *</label>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                <option value="">— Choose a course —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title} — {c.instructor}</option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enrolling...' : 'Enroll Student'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
