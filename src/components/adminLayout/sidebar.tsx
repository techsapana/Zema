import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  X,
  Menu,
  ShieldCheck,
  Images,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Users,
  BookOpen,
  UserCircle,
  CalendarDays,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const sidebarLinks = [
  // {
  //   name: "Dashboard",
  //   icon: <LayoutDashboard size={18} />,
  //   path: "/dashboard",
  // },
  {
    name: "Gallery",
    icon: <Images size={18} />,
    path: "/gallery",
  },
  {
    name: "Reviews",
    icon: <MessageSquare size={18} />,
    path: "/reviews-admin",
  },
  {
    name: "Community",
    icon: <Users size={18} />,
    path: "/community-admin",
  },
  {
    name: "Courses",
    icon: <BookOpen size={18} />,
    path: "/course-admin",
  },
  {
    name: "Instructors",
    icon: <UserCircle size={18} />,
    path: "/instructor-admin",
  },
  {
    name: "Appointments",
    icon: <CalendarDays size={18} />,
    path: "/appointment-admin",
  },
  {
    name: "Enrollments",
    icon: <GraduationCap size={18} />,
    path: "/enrollment-admin",
  },
  {
    name: "Team",
    icon: <UsersRound size={18} />,
    path: "/team-admin",
  },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-200">
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            ZEMA <span className="text-primary-pink">SALON</span>
          </h1>
        </div>
        <span className="mt-2 inline-flex items-center gap-1 bg-primary-pink/10 border border-primary-pink/30 text-primary-pink text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
          <ShieldCheck size={10} />
          Admin Panel
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary-pink/10 text-primary-pink"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="px-4 py-5 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="cursor-pointer w-full flex items-center justify-center gap-2 border border-primary-pink/40 text-primary-pink px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-primary-pink hover:text-white"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-extrabold tracking-tight text-slate-800">
            ZEMA <span className="text-primary-pink">SALON</span>
          </h1>
          <span className="flex items-center gap-1 bg-primary-pink/10 border border-primary-pink/30 text-primary-pink text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full">
            <ShieldCheck size={9} />
            Admin
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="cursor-pointer p-1.5 text-slate-500 hover:text-primary-pink transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-60 bg-white border-r border-slate-200 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-2xl flex flex-col md:hidden
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <button
          className="cursor-pointer absolute top-4 right-4 p-1 text-slate-400 hover:text-primary-pink transition-colors"
          onClick={() => setIsMobileOpen(false)}
        >
          <X size={20} />
        </button>
        <SidebarContent onNavClick={() => setIsMobileOpen(false)} />
      </aside>
    </>
  );
}
