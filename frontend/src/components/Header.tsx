import React from 'react';

const Header = () => {
  return (
    <div className="bg-blue-800 text-white py-2 px-4 text-sm sm:text-base flex justify-between items-center">
      <div className="font-semibold">📚 BookStore</div>
      <div className="hidden sm:flex gap-4">
        <span>Customer Support: +91 9511757691</span>
      </div>
    </div>
  );
};

export default Header;
