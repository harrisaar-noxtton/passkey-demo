import { Toaster } from 'react-hot-toast';
import PasskeyTestingPage from './pages/PasskeyTestingPage';
import './App.css';

function App() {
  return (
    <>
      <PasskeyTestingPage />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
