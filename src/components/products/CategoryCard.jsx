const CategoryCard = ({ name, icon: Icon, image, active, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex-shrink-0 w-40 bg-white border rounded-xl p-3 transition-all cursor-pointer select-none ${
        active 
          ? 'border-green-650 ring-2 ring-green-650/10 shadow-sm' 
          : 'border-gray-100 hover:shadow-md hover:border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${
          active ? 'bg-green-50 text-green-650' : 'bg-gray-50 text-gray-400'
        }`}>
          {Icon ? (
            <Icon size={20} />
          ) : (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
        <span className={`font-bold text-xs leading-snug ${active ? 'text-green-700' : 'text-gray-700'}`}>{name}</span>
      </div>
    </div>
  );
};

export default CategoryCard;