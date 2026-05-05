import React from 'react';

// Ikon kaca pembesar (dimodifikasi agar warnanya bisa dinamis dengan 'currentColor')
const SearchIcon = ({ className = "w-[18px] h-[18px] text-cyprus" }) => (
  <svg className={className} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="currentColor"/>
  </svg>
);

export default function InputField({ 
  variant = "primary", 
  placeholder,
  className = "" 
}) {
  
  // Konfigurasi spesifik untuk masing-masing variasi
  const variantsConfig = {
    "primary": {
      container: "bg-aqua-spring border-transparent px-1.5 py-1.5",
      defaultPlaceholder: "What you're looking for",
      renderAction: () => (
        <button className="inline-flex items-center gap-2 h-full px-4 py-2 bg-white rounded-full hover:opacity-90 transition-all cursor-pointer">
          <SearchIcon />
          <span className="text-label font-normal text-cyprus">Search</span>
        </button>
      )
    },
    "minimal": {
      // Menggunakan border garis abu-abu untuk tampilan dashboard yang lebih bersih
      container: "bg-white border-garis px-4 py-1.5", 
      defaultPlaceholder: "Search data, users, or reports",
      renderAction: () => (
        <button className="inline-flex items-center justify-center p-1 text-grey hover:text-cyprus transition-colors cursor-pointer">
          <SearchIcon className="w-[18px] h-[18px] text-current" />
        </button>
      )
    },
    "subscribe": {
      container: "bg-surf-crest border-transparent px-1.5 py-1.5",
      defaultPlaceholder: "Enter your email address",
      renderAction: () => (
        <button className="inline-flex items-center gap-2 h-full px-5 py-2 bg-white rounded-full hover:opacity-90 transition-all cursor-pointer">
          <span className="text-label font-normal text-cyprus">Subscribe</span>
        </button>
      )
    }
  };

  // Ambil konfigurasi berdasarkan prop `variant` (default ke 'primary' jika tidak valid)
  const current = variantsConfig[variant] || variantsConfig["primary"];
  // Gunakan custom placeholder jika diberikan, jika tidak gunakan bawaan varian
  const activePlaceholder = placeholder || current.defaultPlaceholder;

  return (
    <div className={`inline-flex items-center gap-1.5 w-[453px] h-[48px] rounded-full border focus-within:border-ocean-green focus-within:ring-1 focus-within:ring-ocean-green/20 transition-all ${current.container} ${className}`}>
      
      <input 
        type={variant === "subscribe" ? "email" : "text"} 
        placeholder={activePlaceholder} 
        className="flex-grow bg-transparent outline-none text-body font-normal text-grey placeholder:text-grey/70 pl-2"
      />
      
      {/* Memuat tombol aksi di sebelah kanan sesuai varian */}
      {current.renderAction()}
      
    </div>
  );
}