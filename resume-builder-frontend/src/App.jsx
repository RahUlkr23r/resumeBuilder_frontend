import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AdminPanel from './components/AdminPanel';
import TimeExpired from './components/TimeExpired';
import { checkTime } from './services/timeService';
import { Container, Navbar, Nav, Badge } from 'react-bootstrap';
import './App.css';

function App() {
  const [timeExpired, setTimeExpired] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [remainingTime, setRemainingTime] = useState(20);
  const [savedResumeId, setSavedResumeId] = useState(null);

  useEffect(() => {
    checkTimeStatus();
    const interval = setInterval(checkTimeStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkTimeStatus = async () => {
    try {
      const status = await checkTime();
      setTimeExpired(status.expired);
      setRemainingTime(status.remainingMinutes);
    } catch (error) {
      console.error('Error checking time:', error);
    }
  };

  const handleSaveResume = (data) => {
    setResumeData(data);
    setSavedResumeId(data.id);
  };

  const formatTime = (minutes) => {
    if (minutes < 1) return 'Less than 1 minute';
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  if (timeExpired) {
    return <TimeExpired />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <strong>📄 Dynamic Resume Builder</strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/admin">Admin Panel</Nav.Link>
              </Nav>
              <Navbar.Text className="text-white">
                ⏰ Time Remaining: <Badge bg="warning" text="dark">{formatTime(remainingTime)}</Badge>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          <Routes>
            <Route path="/" element={
              <div className="row">
                <div className="col-md-6">
                  <ResumeForm onSave={handleSaveResume} savedResumeId={savedResumeId} />
                </div>
                <div className="col-md-6">
                  <ResumePreview resumeData={resumeData} />
                </div>
              </div>
            } />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;