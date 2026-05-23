import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

ReactDOM.render(
  <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <App />
  </GoogleOAuthProvider>,
  document.getElementById('root')
);
// ```【22†L285-L293】

// Then on the login page we use the `GoogleLogin` component (already shown above). On successful login, Google returns a credential (`response.credential`) which you should send to your backend to verify and create/log in the user (not shown here). The example code above logs it to console【22†L319-L327】.

// # “Continue with…” Animation (Sliding Forms)

// You can create a sliding effect between login and signup forms by toggling a React state and applying different Tailwind classes. For example, in a top-level component (or modal), you might have:

// ```jsx
const [isSignUpMode, setIsSignUpMode] = useState(false);
const toggleMode = () => setIsSignUpMode(!isSignUpMode);

return (
  <div className={`relative transition-all duration-700 ${isSignUpMode ? 'translate-x-full' : 'translate-x-0'}`}>
    {isSignUpMode ? <RegisterForm /> : <LoginForm />}
  </div>
);
