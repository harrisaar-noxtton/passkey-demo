import React, { useState } from 'react';
import './PasskeyTestingPage.css';
import { usePasskeyAuth } from '../hooks/usePasskeyAuth';
import LogoutView from './passkey-testing-page/LogoutView';
import PasskeyTabs from './passkey-testing-page/PasskeyTabs';
import UsernameInput from './passkey-testing-page/UsernameInput';
import StatusMessage from './passkey-testing-page/StatusMessage';
import LoginWithPasskeyButton from './passkey-testing-page/LoginWithPasskeyButton';
import CreatePasskeyButton from './passkey-testing-page/CreatePasskeyButton';

const PasskeyTestingPage: React.FC = () => {
  const {
    username,
    setUsername,
    isLoggedIn,
    statusMessage,
    handleRegister,
    handleLogin,
    handleLogout
  } = usePasskeyAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const onRegisterClick = async () => {
    const success = await handleRegister();
    if (success) {
      setActiveTab('login');
    }
  };

  if (isLoggedIn) {
    return <LogoutView username={username} onLogout={handleLogout} />;
  }

  return (
    <div className="passkey-page-container">
      <div className="passkey-card">
        <PasskeyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="passkey-content">
          <UsernameInput value={username} onChange={setUsername} />

          <StatusMessage message={statusMessage} />

          {activeTab === 'login' ? (
            <LoginWithPasskeyButton onClick={handleLogin} />
          ) : (
            <CreatePasskeyButton onClick={onRegisterClick} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasskeyTestingPage;
