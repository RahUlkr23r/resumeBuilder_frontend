import React, { useState } from 'react';
import { Card, Button, Alert, Modal, Form, Spinner,  Badge  } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const ResumePreview = ({ resumeData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  if (!resumeData) {
    return (
      <Card className="shadow-sm">
        <Card.Header as="h5" className="bg-secondary text-white">
          <i className="bi bi-eye"></i> Resume Preview
        </Card.Header>
        <Card.Body className="text-center py-5">
          <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem', color: '#ccc' }}></i>
          <p className="text-muted mt-3">Fill the form and click "Save Resume" to see your preview</p>
        </Card.Body>
      </Card>
    );
  }

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/resume/download-pdf/${resumeData.id}`);
      setPdfPassword(response.data.password);
      setShowPassword(true);
      
      // Create download link
      const byteCharacters = atob(response.data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setMessageType('danger');
      setMessage('Failed to download PDF. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${resumeData.fullName} - Resume</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              body { padding: 20px; }
              .resume-header { text-align: center; margin-bottom: 20px; }
              .section-title { color: #0d6efd; border-bottom: 2px solid #0d6efd; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              ${document.querySelector('.resume-preview').innerHTML}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEmail = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/resume/send-email/${resumeData.id}`);
      setMessageType('success');
      setMessage('Email sent successfully! Check your inbox.');
      setEmailSent(true);
      setShowEmailModal(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setMessageType('danger');
      setMessage('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = async () => {
    if (!resumeData.whatsappNumber) {
      setMessageType('warning');
      setMessage('Please add WhatsApp number in the form first');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/resume/send-whatsapp/${resumeData.id}`);
      setMessageType('success');
      setMessage('WhatsApp message sent successfully!');
      setWhatsappSent(true);
      setShowWhatsAppModal(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      if (error.response?.status === 400) {
        setMessageType('warning');
        setMessage('WhatsApp message already sent!');
      } else {
        setMessageType('danger');
        setMessage('Failed to send WhatsApp message.');
      }
    } finally {
      setLoading(false);
    }
  };

  const password = `${resumeData.fullName.replace(/\s+/g, '')}-${resumeData.dob}`;

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="bg-success text-white">
        <i className="bi bi-file-earmark-person"></i> Resume Preview
      </Card.Header>
      <Card.Body>
        {message && (
          <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}
        
        <div className="resume-preview" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <div className="text-center mb-4">
            <h2 className="text-primary">{resumeData.fullName}</h2>
            <p className="mb-1">
              <i className="bi bi-envelope"></i> {resumeData.email} | 
              <i className="bi bi-telephone"></i> {resumeData.phone}
            </p>
            {resumeData.address && (
              <p><i className="bi bi-geo-alt"></i> {resumeData.address}</p>
            )}
          </div>

          <hr />

          {resumeData.summary && (
            <>
              <h5 className="text-primary">Professional Summary</h5>
              <p className="text-muted">{resumeData.summary}</p>
            </>
          )}

          {resumeData.skills && (
            <>
              <h5 className="text-primary mt-3">Skills</h5>
              <p className="text-muted">{resumeData.skills}</p>
            </>
          )}

          {resumeData.experience && (
            <>
              <h5 className="text-primary mt-3">Work Experience</h5>
              <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{resumeData.experience}</p>
            </>
          )}

          {resumeData.education && (
            <>
              <h5 className="text-primary mt-3">Education</h5>
              <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{resumeData.education}</p>
            </>
          )}

          {resumeData.projects && (
            <>
              <h5 className="text-primary mt-3">Projects</h5>
              <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{resumeData.projects}</p>
            </>
          )}

          {resumeData.certifications && (
            <>
              <h5 className="text-primary mt-3">Certifications</h5>
              <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{resumeData.certifications}</p>
            </>
          )}
        </div>

        <hr />

        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <Button 
            variant="primary" 
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : <i className="bi bi-download"></i>} Download PDF
          </Button>
          <Button 
            variant="secondary" 
            onClick={handlePrint}
            disabled={loading}
          >
            <i className="bi bi-printer"></i> Print
          </Button>
          <Button 
            variant="info" 
            onClick={() => setShowEmailModal(true)}
            disabled={emailSent || loading}
          >
            <i className="bi bi-envelope"></i> {emailSent ? 'Email Sent' : 'Email'}
          </Button>
          <Button 
            variant="success" 
            onClick={() => setShowWhatsAppModal(true)}
            disabled={whatsappSent || loading}
          >
            <i className="bi bi-whatsapp"></i> {whatsappSent ? 'WhatsApp Sent' : 'WhatsApp'}
          </Button>
        </div>

        {/* Password Modal */}
        <Modal show={showPassword} onHide={() => setShowPassword(false)}>
          <Modal.Header closeButton>
            <Modal.Title>PDF Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info">
              <strong>Password:</strong> {pdfPassword || password}
            </Alert>
            <p className="text-muted">
              Use this password to open your downloaded resume PDF.
              <br />
              <small>Format: UserName-DOB</small>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPassword(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Email Modal */}
        <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Send Resume via Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Send your password-protected resume to:</p>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control 
                type="email" 
                value={resumeData.email} 
                disabled 
                readOnly 
              />
            </Form.Group>
            <Alert variant="info" className="mt-3">
              <small>
                The email will contain:
                <ul>
                  <li>Password-protected PDF attachment</li>
                  <li>Password: <strong>{password}</strong> in the email body</li>
                </ul>
              </small>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEmail} disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Send Email'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* WhatsApp Modal */}
        <Modal show={showWhatsAppModal} onHide={() => setShowWhatsAppModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Send via WhatsApp</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {resumeData.whatsappNumber ? (
              <>
                <p>Send resume to WhatsApp number:</p>
                <Form.Group>
                  <Form.Label>WhatsApp Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={resumeData.whatsappNumber} 
                    disabled 
                    readOnly 
                  />
                </Form.Group>
                <Alert variant="warning" className="mt-3">
                  <small>⚠️ This action can only be performed once.</small>
                </Alert>
              </>
            ) : (
              <Alert variant="danger">
                Please add a WhatsApp number in the form first.
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowWhatsAppModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="success" 
              onClick={handleWhatsApp} 
              disabled={!resumeData.whatsappNumber || loading || whatsappSent}
            >
              {loading ? <Spinner size="sm" /> : 'Send WhatsApp'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default ResumePreview;