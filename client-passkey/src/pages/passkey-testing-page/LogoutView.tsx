import React from 'react';

interface Props {
    username: string;
    onLogout: () => void;
}

const LogoutView: React.FC<Props> = ({ username, onLogout }) => {
    return (
        <div className="passkey-page-container">
            <div className="passkey-card">
                <div className="passkey-content">
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔓</div>
                        <h2 style={{ color: '#fff', marginBottom: '10px' }}>Welcome back!</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
                            You are securely logged in as<br />
                            <strong style={{ color: '#60a5fa' }}>{username}</strong>
                        </p>

                        <div className="action-section">
                            <button className="secondary-btn" onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutView;
