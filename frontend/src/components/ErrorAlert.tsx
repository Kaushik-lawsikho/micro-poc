// Error alert component
import React from 'react';
import './ErrorAlert.css';

interface ErrorAlertProps {
  error: string | null;
  onClose?: () => void;
  title?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onClose, 
  title = 'Error' 
}) => {
  if (!error) return null;

  return (
    <div className="error-alert">
      <div className="error-header">
        <h4 className="error-title">{title}</h4>
        {onClose && (
          <button className="error-close" onClick={onClose} aria-label="Close error">
            ×
          </button>
        )}
      </div>
      <p className="error-message">{error}</p>
    </div>
  );
};

export default ErrorAlert;
