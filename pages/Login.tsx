import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Button from '../components/Button'; // This should resolve to Button.tsx
import Navbar from '../components/Navbar'; // This should resolve to Navbar.tsx
import Input from '../components/Input'; // This should resolve to Input.tsx


import '../styles/style.css'; // Ensure styles.css has Tailwind directives

const Login: React.FC = () => {
  const [lightMode, setLightMode] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const [isMobileMode, setIsMobileMode] = useState(false); // State to track mobile mode

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side code
      if (lightMode) {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
    }
  }, [lightMode]);

  const toggleLightMode = () => {
    setLightMode(!lightMode);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5036/loginres', { email, password });
      if (response.status === 200) {
        localStorage.setItem('userImage', response.data.image);
        router.push('/ToDoApp');
      }
      if (response.data.message === "Login Successful") {
        localStorage.setItem('token', response.data.token);
        alert('Login In Successfully');
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        setError(error.response.data.message); // Display the specific error message from the server
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth <= 640) {
          const lightModeImage = document.getElementById('lightModeImage');
          if (lightModeImage) {
            lightModeImage.style.display = 'none';
          }
          setIsMobileMode(true);
        } else {
          const lightModeImage = document.getElementById('lightModeImage');
          if (lightModeImage) {
            lightModeImage.style.display = 'block';
          }
          setIsMobileMode(false);
        }
      }
    };

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Initial check on component mount
    handleResize();

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`container ${lightMode ? 'light-mode' : ''}`}>
      <Navbar toggleLightMode={toggleLightMode} lightMode={lightMode} /> {/* Pass toggleLightMode and lightMode as props */}
      <hr className="hr-line" />
      <div className="login">
        <p className="text-white text-3xl">Login</p>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <Input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          id="pwd"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        <p className="text-white">
          Don't have an account yet? <span className="underline-word"><a href="Register" className="text-blue-400">Signup</a></span>
        </p>
        <Button value="Login" /> {/* Pass the value prop here */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
