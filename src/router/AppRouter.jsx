import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard/UserDashboard";
import Checkout from "../pages/Checkout";
import PaymentSummary from "../pages/PaymentSummary";
import MainLayout from "../layouts/MainLayout";
import PaymentSourceSelector from "../components/checkout/PaymentSourceSelector";
import CryptoPaymentSourceSelector from "../components/checkout/CryptoPaymentSourceSelector";

export default function AppRouter() {

  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/checkout" replace />} />

      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <MainLayout>
            <Checkout />
          </MainLayout>
        }
      />

      <Route
        path="/payment-fiat"
        element={
          <MainLayout>
            <PaymentSourceSelector />
          </MainLayout>
        }
      />

      <Route
        path="/payment-crypto"
        element={
          <MainLayout>
            <CryptoPaymentSourceSelector />
          </MainLayout>
        }
      />

      <Route
        path="/paymentsummary"
        element={
          <MainLayout>
            <PaymentSummary />
          </MainLayout>
        }
      />
    </Routes>
  );
}
