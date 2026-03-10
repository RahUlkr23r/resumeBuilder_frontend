import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Alert, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const AdminPanel = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/resumes`);
      setResumes(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setError('Failed to fetch resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resume) => {
    setSelectedResume(resume);
    setEditFormData(resume);
    setShowEditModal(true);
  };

  const handleDelete = (resume) => {
    setSelectedResume(resume);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/admin/resume/${selectedResume.id}`, editFormData);
      setMessage({ type: 'success', text: 'Resume updated successfully!' });
      fetchResumes();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating resume:', error);
      setMessage({ type: 'danger', text: 'Failed to update resume.' });
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/resume/${selectedResume.id}`);
      setMessage({ type: 'success', text: 'Resume deleted successfully!' });
      fetchResumes();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting resume:', error);
      setMessage({ type: 'danger', text: 'Failed to delete resume.' });
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Card className="text-center p-5">
        <Spinner animation="border" variant="primary" className="mx-auto" />
        <p className="mt-3">Loading resumes...</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="bg-dark text-white">
        <i className="bi bi-shield-lock"></i> Admin Panel - Resume Management
      </Card.Header>
      <Card.Body>
        {message && (
          <Alert variant={message.type} dismissible onClose={() => setMessage('')}>
            {message.text}
          </Alert>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <Tabs defaultActiveKey="all" className="mb-3">
          <Tab eventKey="all" title="All Resumes">
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="bg-light">
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>WhatsApp</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.length > 0 ? (
                    resumes.map((resume) => (
                      <tr key={resume.id}>
                        <td>{resume.id}</td>
                        <td>{resume.fullName}</td>
                        <td>{resume.email}</td>
                        <td>{resume.phone}</td>
                        <td>
                          {resume.whatsappNumber ? (
                            <Badge bg="success">✓</Badge>
                          ) : (
                            <Badge bg="secondary">✗</Badge>
                          )}
                        </td>
                        <td>{formatDate(resume.createdAt)}</td>
                        <td>
                          {resume.emailSent && <Badge bg="info" className="me-1">Email</Badge>}
                          {resume.whatsappSent && <Badge bg="success">WhatsApp</Badge>}
                          {!resume.emailSent && !resume.whatsappSent && (
                            <Badge bg="warning">Pending</Badge>
                          )}
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleEdit(resume)}
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(resume)}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">No resumes found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Tab>
          <Tab eventKey="sent" title="Email Sent">
            {/* Similar table with filter for email sent */}
          </Tab>
        </Tabs>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Resume - {selectedResume?.fullName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={editFormData.fullName || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editFormData.email || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={editFormData.phone || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>WhatsApp Number</Form.Label>
                <Form.Control
                  type="text"
                  name="whatsappNumber"
                  value={editFormData.whatsappNumber || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={editFormData.address || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="summary"
                  value={editFormData.summary || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Skills</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="skills"
                  value={editFormData.skills || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="experience"
                  value={editFormData.experience || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Education</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="education"
                  value={editFormData.education || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Projects</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="projects"
                  value={editFormData.projects || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Certifications</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="certifications"
                  value={editFormData.certifications || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="warning">
              Are you sure you want to delete the resume of <strong>{selectedResume?.fullName}</strong>?
              <br />
              This action cannot be undone.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete Permanently
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default AdminPanel;