import React, { useState } from 'react';
import axios from 'axios';
import { 
  Form, 
  Button, 
  Card, 
  Alert, 
  Row, 
  Col, 
  Badge,
  Spinner 
} from 'react-bootstrap';
import { API_BASE_URL } from '../services/api';

const ResumeForm = ({ onSave, savedResumeId }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    address: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    projects: '',
    certifications: '',
    dob: ''
  });

  const [educationEntries, setEducationEntries] = useState([{ 
    id: 1, 
    degree: '', 
    institution: '', 
    year: '' 
  }]);
  
  const [experienceEntries, setExperienceEntries] = useState([{ 
    id: 1, 
    company: '', 
    position: '', 
    duration: '', 
    description: '' 
  }]);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const addEducation = () => {
    setEducationEntries([...educationEntries, { 
      id: educationEntries.length + 1, 
      degree: '', 
      institution: '', 
      year: '' 
    }]);
  };

  const removeEducation = (id) => {
    if (educationEntries.length > 1) {
      setEducationEntries(educationEntries.filter(entry => entry.id !== id));
    }
  };

  const updateEducation = (index, field, value) => {
    const updated = [...educationEntries];
    updated[index][field] = value;
    setEducationEntries(updated);
  };

  const addExperience = () => {
    setExperienceEntries([...experienceEntries, { 
      id: experienceEntries.length + 1, 
      company: '', 
      position: '', 
      duration: '', 
      description: '' 
    }]);
  };

  const removeExperience = (id) => {
    if (experienceEntries.length > 1) {
      setExperienceEntries(experienceEntries.filter(entry => entry.id !== id));
    }
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experienceEntries];
    updated[index][field] = value;
    setExperienceEntries(updated);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.phone.trim()) return 'Phone is required';
    if (!formData.dob.trim()) return 'Date of Birth is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email format';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    // Format education entries
    const educationText = educationEntries
      .filter(edu => edu.degree && edu.institution)
      .map(edu => `${edu.degree} from ${edu.institution} (${edu.year || 'Year not specified'})`)
      .join('\n');
    
    // Format experience entries
    const experienceText = experienceEntries
      .filter(exp => exp.company && exp.position)
      .map(exp => 
        `${exp.position} at ${exp.company} - ${exp.duration || 'Duration not specified'}\n${exp.description || 'No description'}`
      )
      .join('\n\n');

    const finalData = {
      ...formData,
      education: educationText || 'No education details provided',
      experience: experienceText || 'No experience details provided'
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/resume/save`, finalData);
      onSave(response.data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving resume:', error);
      if (error.response?.status === 403) {
        setError('Submission time has expired. Please refresh the page.');
      } else {
        setError('Failed to save resume. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="bg-primary text-white">
        <i className="bi bi-pencil-square"></i> Build Your Resume
        {savedResumeId && (
          <Badge bg="success" className="ms-2">Saved ✓</Badge>
        )}
      </Card.Header>
      <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {showSuccess && (
          <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
            Resume saved successfully!
          </Alert>
        )}
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <h6 className="mt-2 text-primary">Personal Information</h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>WhatsApp Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                />
                <Form.Text className="text-muted">
                  Required for WhatsApp feature
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mt-3 text-primary">Professional Summary</h6>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="Brief summary of your professional background..."
            />
          </Form.Group>

          <h6 className="mt-3 text-primary">Education</h6>
          {educationEntries.map((entry, index) => (
            <div key={entry.id} className="education-entry mb-3 p-3 border rounded bg-light">
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Degree</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="B.Sc. Computer Science"
                      value={entry.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Institution</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="University Name"
                      value={entry.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="2020-2024"
                      value={entry.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  {educationEntries.length > 1 && (
                    <Button variant="outline-danger" size="sm" onClick={() => removeEducation(entry.id)}>
                      ✕
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          ))}
          <Button variant="outline-primary" size="sm" onClick={addEducation} className="mb-3">
            + Add Education
          </Button>

          <h6 className="mt-3 text-primary">Work Experience</h6>
          {experienceEntries.map((entry, index) => (
            <div key={entry.id} className="experience-entry mb-3 p-3 border rounded bg-light">
              <Row>
                <Col md={5}>
                  <Form.Group className="mb-2">
                    <Form.Label>Company</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Company Name"
                      value={entry.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Software Engineer"
                      value={entry.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="2020-Present"
                      value={entry.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  {experienceEntries.length > 1 && (
                    <Button variant="outline-danger" size="sm" onClick={() => removeExperience(entry.id)}>
                      ✕
                    </Button>
                  )}
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Key responsibilities and achievements..."
                  value={entry.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                />
              </Form.Group>
            </div>
          ))}
          <Button variant="outline-primary" size="sm" onClick={addExperience} className="mb-3">
            + Add Experience
          </Button>

          <h6 className="mt-3 text-primary">Skills</h6>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="JavaScript, React, Node.js, Python (comma separated)"
            />
          </Form.Group>

          <h6 className="mt-3 text-primary">Projects</h6>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              name="projects"
              value={formData.projects}
              onChange={handleInputChange}
              placeholder="Describe your key projects..."
            />
          </Form.Group>

          <h6 className="mt-3 text-primary">Certifications</h6>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={2}
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
              placeholder="List your certifications..."
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                'Save Resume'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ResumeForm;