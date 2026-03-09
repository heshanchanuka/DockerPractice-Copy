import { useState, useEffect } from 'react';
import { getCourses, deleteCourse } from '../../services/api';
import CourseForm from './CourseForm';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      setError('Failed to load courses. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch {
      setError('Failed to delete course.');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCourse(null);
    fetchCourses();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>📚 Courses</h1>
          <p>Manage all available courses in the system</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Course
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>No courses yet</h3>
            <p>Click "Add Course" to create your first course.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Duration</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, i) => (
                  <tr key={course.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{course.title}</td>
                    <td>
                      <span className="badge badge-purple">{course.instructor}</span>
                    </td>
                    <td>
                      {course.durationHours
                        ? <span className="badge badge-blue">{course.durationHours}h</span>
                        : <span style={{ color: 'var(--text-subtle)' }}>—</span>
                      }
                    </td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {course.description || '—'}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-edit btn-sm" onClick={() => handleEdit(course)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course.id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <CourseForm course={editingCourse} onClose={handleFormClose} />
      )}
    </div>
  );
}
