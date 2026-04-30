import React from 'react';

import { FaHome } from 'react-icons/fa'

export default function PropertyImage({ imageUrl, name, tags, isHovered }) {
  const badge = tags && tags[0] ? tags[0] : null;

  return (
    <div className="relative w-full h-52 overflow-hidden">
      <img
        src={imageUrl}
        alt={name}
        className={`w-full h-full object-cover transition-transform duration-500 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
      />

      {/* Badge tag oranye — pojok kanan atas */}
      {badge && (
        <div className="absolute top-0 right-0 bg-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase shadow-md">
          {badge}
        </div>
      )}
    </div>
  );
}