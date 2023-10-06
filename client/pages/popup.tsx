import { useState } from 'react';
import Login from './login';
import Register from './register';

const Auth = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  
  const togglePopup = () => {
    setIsLoginOpen(!isLoginOpen);
  };
  
  return (
    <div className="auth-modal">
      {isLoginOpen ? (
        <Login onRegisterClick={togglePopup} />
      ) : (
        <Register onLoginClick={togglePopup} />
      )}
    </div>
  );
};
  
export default Auth;