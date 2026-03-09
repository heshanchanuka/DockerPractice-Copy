import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Courses ───────────────────────────────────────────────
export const getCourses = () => api.get('/courses');
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const countCourses = () => api.get('/courses/count');

// ─── Students ──────────────────────────────────────────────
export const getStudents = () => api.get('/students');
export const getStudentById = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const countStudents = () => api.get('/students/count');

// ─── Enrollments ───────────────────────────────────────────
export const getEnrollments = () => api.get('/enrollments');
export const createEnrollment = (courseId, studentId) =>
  api.post('/enrollments', { courseId, studentId });
export const deleteEnrollment = (id) => api.delete(`/enrollments/${id}`);
export const countEnrollments = () => api.get('/enrollments/count');

export default api;
