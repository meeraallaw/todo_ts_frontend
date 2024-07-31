import React from 'react';

const Button = ({ value }) => {
  return (
    <input
      type="submit"
      value={value} // Use the value prop here
      className="w-40 h-10 px-4 mt-2 rounded-lg bg-white text-gray-800 hover:bg-gray-300 cursor-pointer"
    />
  );
};

export default Button;
