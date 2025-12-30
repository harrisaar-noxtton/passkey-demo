import React from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const UsernameInput: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div className="input-group">
            <input
                type="email"
                id="username"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your email"
            />
        </div>
    );
};

export default UsernameInput;
