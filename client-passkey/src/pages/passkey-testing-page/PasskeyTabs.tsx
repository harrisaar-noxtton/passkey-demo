import React from 'react';

interface Props {
  activeTab: 'login' | 'register';
  setActiveTab: (tab: 'login' | 'register') => void;
}

const PasskeyTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="passkey-tabs">
      <button
        className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
        onClick={() => setActiveTab('login')}
      >
        Login
      </button>
      <button
        className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
        onClick={() => setActiveTab('register')}
      >
        Register
      </button>
    </div>
  );
};

export default PasskeyTabs;
