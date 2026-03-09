import { useState } from 'react';
import { createCourse, updateCourse } from '../../services/api';

export default function CourseForm({ course, onClose }) {
  const isEdit = !!course;
  const [form, setForm] = useState({
    title: course?.title || '',
    description: course?.description || '',
    instructor: course?.instructor || '',
    durationHours: course?.durationHours || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.instructor.trim()) {
      setError('Title and Instructor are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        durationHours: form.durationHours ? Number(form.durationHours) : null,
      };
      if (isEdit) {
        await updateCourse(course.id, payload);
      } else {
        await createCourse(payload);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? '✏️ Edit Course' : '📚 Add New Course'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to Python"
            />
          </div>
          <div className="form-group">
            <label>Instructor *</label>
            <input
              type="text"
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              placeholder="e.g. Dr. John Smith"
            />
          </div>
          <div className="form-group">
            <label>Duration (hours)</label>
            <input
              type="number"
              name="durationHours"
              value={form.durationHours}
              onChange={handleChange}
              placeholder="e.g. 40"
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief course description..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
