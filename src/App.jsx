import { Suspense } from "react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import "./assets/tailwind.css";

// React Lazy — semua halaman di-lazy load
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Obat = React.lazy(() => import("./pages/Obat"));
const Transaksi = React.lazy(() => import("./pages/Transaksi"));
const OrderManagement = React.lazy(() => import("./pages/OrderManagement"));
const Pelanggan = React.lazy(() => import("./pages/Pelanggan"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"));
const MainLayout = React.lazy(() => import("./layouts/MainLayouts"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const ComponentTest = React.lazy(() => import("./pages/ComponentTest"));
const ProductDetail = React.lazy(() => import("./pages/products/ProductDetail"));
const Products = React.lazy(() => import("./pages/Products"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* MainLayout — Halaman Admin Apotek */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/obat" element={<Obat />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/order-management" element={<OrderManagement />} />
          <Route path="/pelanggan" element={<Pelanggan />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/test" element={<ComponentTest />} />

          {/* Error Routes */}
          <Route path="/error/400" element={<ErrorPage kodeError="400" deskripsiError="Bad Request! Ada yang salah dengan permintaanmu." />} />
          <Route path="/error/401" element={<ErrorPage kodeError="401" deskripsiError="Unauthorized! Kamu harus login terlebih dahulu." />} />
          <Route path="/error/403" element={<ErrorPage kodeError="403" deskripsiError="Forbidden! Kamu tidak punya akses ke halaman ini." />} />
          <Route path="/error/404" element={<ErrorPage kodeError="404" deskripsiError="Halaman tidak ditemukan." />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* AuthLayout — Halaman Login/Register */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
