import React from 'react';

interface Props {
    onClick: () => void;
}

const CreatePasskeyButton: React.FC<Props> = ({ onClick }) => {
    return (
        <div className="action-section">
            <button className="secondary-btn" onClick={onClick}>
                <span className="icon">🛡️</span> Create Passkey
            </button>
        </div>
    );
};

export default CreatePasskeyButton;
