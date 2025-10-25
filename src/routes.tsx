import { Routes, Route, BrowserRouter } from "react-router-dom";
// @ts-ignore - App.jsx does not have a declaration file; treat as any
import App from "./App";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
// @ts-ignore -ProtectedRoute does not export a module; treat as any
import ProtectedRoute from "./auth/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
