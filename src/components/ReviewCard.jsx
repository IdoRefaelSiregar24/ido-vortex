import React from 'react';

// Komponen Ikon Bintang (SVG)
const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.63L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27Z" />
  </svg>
);

export default function ReviewCard({ 
  name = "John D", 
  review = "Fast delivery and fantastic quality! The customer support team was quick to resolve my query. Dealport has earned a loyal customer.", 
  avatarUrl = "https://i.pravatar.cc/150?img=11", // Placeholder gambar
  rating = 5,
  isSelected = false 
}) {
  
  return (
    <div 
      className={`
        flex flex-col w-[440px] h-[180px] p-[22px] gap-[9px] rounded-[13px] transition-all duration-300
        ${isSelected 
          ? 'bg-aqua-spring border-transparent' 
          : 'bg-white border border-gray-200'
        }
      `}
    >
      {/* Bagian Header: Avatar, Nama, dan Bintang */}
      <div className="flex items-center gap-[9px]">
        
        {/* Avatar */}
        <img 
          src={avatarUrl} 
          alt={name} 
          className="w-[52px] h-[52px] rounded-xl object-cover" 
        />
        
        {/* Nama Pengguna */}
        <h4 className="text-dashboard font-bold text-cyprus whitespace-nowrap">
          {name}
        </h4>
        
        {/* Render Bintang Sesuai Rating */}
        <div className="flex items-center gap-1 text-pending ml-2">
          {[...Array(rating)].map((_, index) => (
            <StarIcon key={index} />
          ))}
        </div>
        
      </div>

      {/* Bagian Teks Ulasan */}
      <p className="text-body text-cyprus leading-relaxed mt-1">
        "{review}"
      </p>
      
    </div>
  );
}