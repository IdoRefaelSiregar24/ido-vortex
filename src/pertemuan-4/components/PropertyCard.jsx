import React, { useRef, useState } from 'react';
import PropertyImage from './PropertyImage';
import PropertyHeader from './PropertyHeader';
import PropertyPrice from './PropertyPrice';
import PropertySpecs from './PropertySpecs';
import PropertyModal from './PropertyModal';

export default function PropertyCard({ property }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -10;
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 10;
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`
    );
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
    setIsHovered(false);
  };

  return (
    <>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-shadow duration-300 ${
          isHovered ? 'shadow-2xl' : 'shadow-md'
        }`}
        style={{
          transform,
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.3s ease'
            : 'transform 0.5s ease, box-shadow 0.5s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        <PropertyImage
          imageUrl={property.imageUrl}
          name={property.name}
          tags={property.tags}
          isHovered={isHovered}
        />

        <div className="p-5 flex flex-col flex-grow">
          <PropertyHeader
            name={property.name}
            location={property.details.location}
          />

          <PropertySpecs specs={property.details.specs} />

          <PropertyPrice
            price={property.details.price}
            onViewDetails={() => setShowModal(true)}
          />
        </div>
      </div>

      {showModal && (
        <PropertyModal property={property} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}