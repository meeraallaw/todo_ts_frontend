import React from 'react';
import '../styles/style.css'; // Ensure styles.css has Tailwind directives

const Input = ({ value, onChange, type, id, name, placeholder }) => {
  return (
    <div className="login-form"> {/* Apply the login-form style */}
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />

    </div>
  );
};

export default Input;
