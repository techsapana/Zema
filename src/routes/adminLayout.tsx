import AdminSidebar from "../components/adminLayout/sidebar";
import { Outlet, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function AdminLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background-light text-slate-900">
      <AdminSidebar />
      {/* Main content — offset by sidebar width on desktop, offset by mobile bar on mobile */}
      <main className="md:ml-60 pt-14 md:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
