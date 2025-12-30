import React from 'react';

interface Props {
    message: string;
}

const StatusMessage: React.FC<Props> = ({ message }) => {
    if (!message) return null;

    const isError = message.includes('Error');

    return (
        <div style={{
            marginBottom: '15px',
            padding: '8px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            textAlign: 'center',
            backgroundColor: isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isError ? '#fca5a5' : '#6ee7b7'
        }}>
            {message}
        </div>
    );
};

export default StatusMessage;
