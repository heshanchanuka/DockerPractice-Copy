import { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../../services/api';
import StudentForm from './StudentForm';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch {
      setError('Failed to load students. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch {
      setError('Failed to delete student.');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
    fetchStudents();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>👨‍🎓 Students</h1>
          <p>Manage all registered students</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Student
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍🎓</div>
            <h3>No students yet</h3>
            <p>Click "Add Student" to register a student.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => (
                  <tr key={student.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                    <td>
                      {student.phone
                        ? <span className="badge badge-blue">{student.phone}</span>
                        : <span style={{ color: 'var(--text-subtle)' }}>—</span>
                      }
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {student.createdAt
                        ? new Date(student.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-edit btn-sm" onClick={() => handleEdit(student)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>🗑️ Delete</button>
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
        <StudentForm student={editingStudent} onClose={handleFormClose} />
      )}
    </div>
  );
}
