import React, { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import SearchField from "../components/SearchField";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import OrderStatCard from "../components/OrderStatCard";
import Pagination from "../components/Pagination";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";
import SalesCard from "../components/SalesCard";
import UsersActiveCard from "../components/UsersActiveCard";
import AddNewProduct from "../components/AddNewProduct";
import BestSellingProduct from "../components/BestSellingProduct";
import TopProducts from "../components/TopProducts";
import CustomerOverviewChart from "../components/CustomerOverviewChart";
import CustomerTable from "../components/CustomerTable";
import TransactionTable from "../components/TransactionTable";
import OrderTable from "../components/OrderTable";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// Products sub-components
import CategoryCard from "../components/products/CategoryCard";
import ProductBasicDetails from "../components/products/ProductBasicDetails";
import ProductCategorization from "../components/products/ProductCategorization";
import ProductDetailHeader from "../components/products/ProductDetailHeader";
import ProductImageGallery from "../components/products/ProductImageGallery";
import ProductInventory from "../components/products/ProductInventory";
import ProductList from "../components/products/ProductList";
import ProductPricing from "../components/products/ProductPricing";
import ProductTable from "../components/products/ProductTable";
import ReportChart from "../components/ReportChart";

// Shadcn UI Components
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

export default function Components() {
  const [openSections, setOpenSections] = useState([1]); // First section open by default
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSection = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Trigger fullscreen loading for 2 seconds
  const triggerLoading = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 2000);
  };

  const sampleProduct = {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Paracetamol is a commonly used medicine that can help treat pain and reduce a high temperature (fever). It's typically used to relieve mild or moderate pain.",
    price: "$5.99",
    stock: 45,
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=400&h=400&q=80"
  };

  if (showLoading) {
    return <Loading />;
  }

  const sections = [
    {
      id: 1,
      title: "1. Basic Component",
      content: (
        <div className="space-y-8 animate-fadeIn pb-4">
          {/* Buttons Showcase */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Button Variants</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Primary</span>
                <Button variant="primary">Primary Button</Button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Secondary</span>
                <Button variant="secondary">Secondary Button</Button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Accent</span>
                <Button variant="accent">Accent Button</Button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Gradient</span>
                <Button variant="gradient">Gradient Button</Button>
              </div>
            </div>
          </div>

          {/* Pagination Showcase */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Pagination Component</h3>
            <p className="text-sm text-gray-500 mb-4">Current Page State: {currentPage} / 10</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Pagination currentPage={currentPage} totalPages={10} onPageChange={(page) => setCurrentPage(page)} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "2. Layout Component",
      content: (
        <div className="space-y-8 animate-fadeIn pb-4">
          {/* PageHeader Showcase */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Page Header</h3>
            <PageHeader title="Overview & Statistics" breadcrumb={["Admin", "Dashboard", "Overview"]}>
              <Button variant="primary" className="!py-1.5 !px-4 !text-sm">Action Button</Button>
            </PageHeader>
          </div>

          {/* Header Component Showcase */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500">
              HEADER COMPONENT PREVIEW
            </div>
            <Header />
          </div>

          {/* Sidebar Component Showcase */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500">
              SIDEBAR COMPONENT PREVIEW
            </div>
            <div className="h-[400px] overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "3. Data Display Component",
      content: (
        <div className="space-y-8 animate-fadeIn pb-4">
          {/* Stats Cards Row */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Order Statistics Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <OrderStatCard title="Total Orders (Trend Up)" value="1,240" trendValue="14.4%" trendDirection="up" />
              <OrderStatCard title="Canceled Orders (Trend Down)" value="87" trendValue="5%" trendDirection="down" />
              <OrderStatCard title="Completed Orders (Trend None)" value="960" trendValue="" trendDirection="none" />
            </div>
          </div>

          {/* Sales, Category & Product Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Sales Card</h3>
              <div className="flex justify-center">
                <SalesCard />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Category Card</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <CategoryCard name="Electronic Accessories" image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&h=120&q=80" />
                <CategoryCard name="Fashion Store" image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=120&h=120&q=80" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Product Card (Single Row Layout)</h3>
              <div className="bg-gray-50 rounded-lg p-2">
                <ProductCard id="1" index="1" name="Premium Quality Cotton T-Shirt" createdDate="12 May 2026" order="150" image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=80&h=80&q=80" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Customer Overview Chart</h3>
              <CustomerOverviewChart />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Report Weekly Chart</h3>
              <ReportChart />
            </div>
          </div>

          {/* Users Active Card */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Users Active & Country Stats Card</h3>
            <UsersActiveCard />
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "4. Form Component",
      content: (
        <div className="space-y-8 animate-fadeIn pb-4">
          {/* Inputs Showcase */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Input & Search Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">InputField Component</h4>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Primary variant</span>
                  <InputField variant="primary" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Minimal variant</span>
                  <InputField variant="minimal" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Subscribe variant</span>
                  <InputField variant="subscribe" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">SearchField Component</h4>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Primary variant</span>
                  <SearchField variant="primary" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Minimal variant</span>
                  <SearchField variant="minimal" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Subscribe variant</span>
                  <SearchField variant="subscribe" />
                </div>
              </div>
            </div>
          </div>

          {/* Add New Product widget & Categorization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Add New Product Widget</h3>
              <AddNewProduct />
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Product Categorization Selector</h3>
              <ProductCategorization />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "5. Feedback Component",
      content: (
        <div className="space-y-8 animate-fadeIn pb-4">
          {/* Quick Actions / Demos */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Interactions Demo</h3>
            <div className="flex items-center gap-3">
              <Button variant="primary" onClick={triggerLoading}>
                Test Loading State
              </Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                Test Modal Component
              </Button>
            </div>
          </div>

          {/* Review Cards Showcase */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Review Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-gray-400 mb-1 block">Default Style</span>
                <ReviewCard name="Robert Downey" review="Outstanding service and top quality items. Delivery was incredibly swift." rating={5} isSelected={false} />
              </div>
              <div>
                <span className="text-xs text-gray-400 mb-1 block">Selected Style (Aqua Spring BG)</span>
                <ReviewCard name="Jessica Alba" review="I had a great experience with my purchase. Responsive customer support!" rating={4} isSelected={true} />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "6. Section Component",
      content: (
        <div className="space-y-8 animate-fadeIn pb-4">
          {/* Product Table */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">ProductTable Component</h3>
            <ProductTable />
          </div>

          {/* Order Table */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">OrderTable Component</h3>
            <OrderTable />
          </div>

          {/* Customer Table */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">CustomerTable Component</h3>
            <CustomerTable />
          </div>

          {/* Transaction Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">TransactionTable Component</h3>
              <TransactionTable />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">BestSellingProduct Component</h3>
              <BestSellingProduct />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">TopProducts Component</h3>
            <div className="max-w-md">
              <TopProducts />
            </div>
          </div>

          {/* Product Detail Components */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Product Detail Header Component</h3>
            <ProductDetailHeader />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Product Image Gallery</h3>
                <ProductImageGallery product={sampleProduct} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Product Basic Details</h3>
                <ProductBasicDetails product={sampleProduct} />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Product Pricing</h3>
                <ProductPricing product={sampleProduct} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Product Inventory</h3>
                <ProductInventory product={sampleProduct} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Complete ProductList Component</h3>
            <ProductList />
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "7. Shadcn UI Components",
      content: (
        <div className="space-y-8 animate-fadeIn pb-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Input (Shadcn)</h3>
            <div className="max-w-sm">
              <Input type="email" placeholder="Email address" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Alert (Shadcn)</h3>
            <Alert>
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                Shadcn UI components have been successfully integrated into the project.
              </AlertDescription>
            </Alert>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Table (Shadcn)</h3>
            <Table>
              <TableCaption>A list of recent transactions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV002</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>PayPal</TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-cyprus">Component Explorer & Playground</h1>
            <p className="text-sm text-gray-500">Live preview of all UI components in the dealport design system</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Accordion List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-2">
          {sections.map((sec) => {
            const isOpen = openSections.includes(sec.id);
            return (
              <div key={sec.id} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full flex items-center gap-3 text-left py-4 focus:outline-none hover:bg-gray-50 rounded-lg px-3 transition-colors duration-150 group"
                >
                  <svg
                    className={`w-2.5 h-2.5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-lg font-bold text-cyprus group-hover:text-ocean-green transition-colors duration-150">
                    {sec.title}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="mt-2 pl-4 sm:pl-8 pr-2">
                    {sec.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Modal Component Demo */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Test Modal Component">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This is the live instance of the <code>Modal</code> component. It features full backdrop-blur styling, responsive centering, and an easy closing trigger.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="accent" onClick={() => setIsModalOpen(false)} className="!text-sm !py-1.5 !px-4">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)} className="!text-sm !py-1.5 !px-4">
              Confirm Actions
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
