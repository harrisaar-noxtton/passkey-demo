import React from 'react';

interface Props {
    onClick: () => void;
}

const LoginWithPasskeyButton: React.FC<Props> = ({ onClick }) => {
    return (
        <div className="action-section">
            <button className="primary-btn" onClick={onClick}>
                <span className="icon">🔑</span> Login with Passkey
            </button>
        </div>
    );
};

export default LoginWithPasskeyButton;
