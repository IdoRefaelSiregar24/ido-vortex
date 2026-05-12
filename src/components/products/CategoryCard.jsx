import React from 'react';

const CategoryCard = ({ name, image }) => {
  return (
    <div className="flex-shrink-0 w-40 bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-gray-800 text-sm line-clamp-2">{name}</span>
      </div>
    </div>
  );
};

export default CategoryCard;