import React from 'react';
import '../styles/style.css'; // Ensure styles.css has Tailwind directives

const Navbar = ({ toggleLightMode, lightMode }) => {
  return (
    <div className="login-form">
    <div className="header">
      <div className="header-title">
        <h1 className="text-3xl font-bold">TO DO APP</h1>
        <p>Stop Procrastinating, Start Organizing</p>
      </div>
      <div className="user-icon">
        <img
          id="lightModeImage"
          src={lightMode ? '/Group2.png' : '/Group.png'}
          alt="Toggle Light Mode"
          onClick={toggleLightMode}
        />
        <img
          src="/photo.png"
          alt="Profile"
          className="ml-2"
        />
      </div>
    </div>
    </div>
  );
};

export default Navbar;
