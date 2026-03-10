import React from 'react';
import { Card, Alert, Button } from 'react-bootstrap';

const TimeExpired = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ maxWidth: '500px' }} className="shadow-lg">
        <Card.Header className="bg-danger text-white text-center">
          <h3>⏰ Time Expired</h3>
        </Card.Header>
        <Card.Body className="text-center p-5">
          <i className="bi bi-clock-history" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
          
          <Alert variant="danger" className="mt-4">
            <h5>Resume submission time has expired.</h5>
            <p className="mb-0">
              The 20-minute submission window for this session has ended.
            </p>
          </Alert>

          <Alert variant="info" className="mt-3">
            <p className="mb-2">
              <strong>Note:</strong> This is a time-controlled demo application.
              Each deployment allows resume submissions for only 20 minutes.
            </p>
            <p className="mb-0">
              Please contact the administrator if you need to submit a resume.
            </p>
          </Alert>

          <div className="mt-4">
            <Button 
              variant="primary" 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
            >
              <i className="bi bi-arrow-clockwise"></i> Refresh Page
            </Button>
          </div>
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          <small>
            Deployment Time: {new Date().toLocaleString()}
            <br />
            CRCCF Official HR: 9777999529
          </small>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default TimeExpired;