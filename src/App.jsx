import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/Courses/CourseList';
import StudentList from './pages/Students/StudentList';
import EnrollmentList from './pages/Enrollments/EnrollmentList';

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <main className="page-body">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/enrollments" element={<EnrollmentList />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
