import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../styles/style.css';
import Navbar from '../components/Navbar'; // Import Navbar component
import Button from '../components/Button'; // Import Button component
import Input from '../components/Input'; // Import Input component

const Register: React.FC = () => {
  const [lightMode, setLightMode] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [cpassword, setCpassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [isMobileMode, setIsMobileMode] = useState(false); // State for mobile mode detection
  const router = useRouter();

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

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.onerror = error => {
        console.log("Error: ", error);
      };
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password !== cpassword) {
      setError('Passwords do not match');
      return;
    }

    axios.post('http://localhost:5036/signupres', { email, password, cpassword, image })
      .then((result) => {
        console.log(result.data);
        setSuccess(result.data.message);
        setError('');
        // Redirect to login page
        router.push('/Login');
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const lightModeImage = document.getElementById('lightModeImage');
        if (window.innerWidth <= 640) {
          if (lightModeImage) {
            lightModeImage.style.display = 'none';
          }
          setIsMobileMode(true);
        } else {
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
    <div className="register-body">
      <div className={`container ${lightMode ? 'light-mode' : ''} mx-auto p-4`}>
        <Navbar toggleLightMode={toggleLightMode} lightMode={lightMode} /> {/* Pass toggleLightMode and lightMode as props */}
        <hr className="hr-line" />
        <div className="login">
          <p className="text-white text-3xl">Register</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form space-y-4">
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
          <Input
            type="password"
            id="pwd"
            name="cpassword"
            placeholder="Confirm Password"
            value={cpassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCpassword(e.target.value)}
          />
          <div className="profile">
            <label htmlFor="profileImage" className="w-40 h-10 px-4 mt-2 rounded-lg bg-white text-gray-800 hover:bg-gray-300 cursor-pointer flex items-center justify-center">
              Choose Profile Picture
              <input
                id="profileImage"
                accept="image/*"
                type="file"
                onChange={handlePictureChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          {image && <img width={100} height={100} src={image as string} alt="Preview" />}
          <p className="text-white">
            Already have an account?{' '}
            <a href="/Login" className="text-blue-400">Login</a>
          </p>
          <Button value="Register" /> {/* Pass the value prop here */}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
