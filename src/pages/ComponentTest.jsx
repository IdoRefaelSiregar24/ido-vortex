import React from "react";
import Button from "../components/Button";
import ProductCard   from '../components/ProductCard';
// import Header from '../components/Header';
// import Loading from '../components/Loading';
// import Modal from '../components/Modal';
// import PageHeader from '../components/PageHeader';
import ReviewCard from '../components/ReviewCard';
import SearchField from '../components/SearchField';
import SalesCard from '../components/SalesCard';
// import Sidebar from '../components/Sidebar';

const ComponentTest = () => {
  // const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Component Test Page</h1>

      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">PageHeader</h2>
        <PageHeader title="Test Page" subtitle="This is a subtitle" />
      </div> */}

      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Header</h2>
        <Header />
      </div> */}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Button</h2>
        <div className="flex space-x-2">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="accent">Accent Button</Button>
          <Button variant="gradient">Gradient Button</Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Review Card</h2>
        <div className="flex space-x-2">
          <ReviewCard></ReviewCard>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Review Card</h2>
        <div className="flex space-x-2">
          <SearchField></SearchField>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Card</h2>
        <div className="flex space-x-2">
          <ProductCard 
            title="Nike Air Force 1"
            imageUrl="https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&w=400&q=80"
            rating={4}
            currentPrice={120}
            originalPrice={150}
            discountLabel="20% OFF"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sidebar</h2>
        
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sales Card</h2>
        <div className="flex space-x-2">
          <SalesCard />
        </div>
      </div>

      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">ReviewCard</h2>
        <ReviewCard
          review={{
            user: 'John Doe',
            rating: 4,
            comment: 'This is a great product! I highly recommend it.',
          }}
        />
      </div> */}

      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">SearchField</h2>
        <SearchField />
      </div> */}
    </div>
  );
};

export default ComponentTest;
