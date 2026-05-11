export default function Button({ children, onClick, variant = "primary", className = "", }) {
        const baseClasses =
          "inline-flex items-center justify-center px-5 py-2.5 font-bold rounded-full gap-2.5 transition-all duration-200 cursor-pointer text-button";
      
        const variants = {
          primary: "bg-ocean-green text-white hover:opacity-90",
          secondary: "bg-surf-crest text-cyprus hover:opacity-80",
          accent:
            "bg-transparent border border-cyprus text-cyprus hover:bg-aqua-spring",
          gradient: "bg-primary-cta text-white hover:opacity-90",
        };
      
      
        const variantClasses = variants[variant] || variants["primary"];
      
        return (
          <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses} ${className}`}
          >
            {children}
          </button>
        );
      }
