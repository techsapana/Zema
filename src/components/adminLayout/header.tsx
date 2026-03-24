import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  X,
  ChevronDown,
  Menu,
  ShieldCheck,
  Images,
  GraduationCap,
  CalendarDays,
  Users,
} from "lucide-react";

const adminSections: {
  name: string;
  icon: React.ReactNode;
  path?: string;
  children?: { name: string; path: string }[];
}[] = [
  {
    name: "Gallery",
    icon: <Images size={15} />,
    path: "/admin/gallery",
  },
  {
    name: "Enrollments",
    icon: <GraduationCap size={15} />,
    path: "/admin/enrollments",
  },
  {
    name: "About",
    icon: <Users size={15} />,
    path: "/admin/about",
  },
  {
    name: "Events",
    icon: <CalendarDays size={15} />,
    path: "/admin/events",
  },
];

export default function AdminHeader() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-primary-pink/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="cursor-pointer flex items-center gap-3"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  ZEMA <span className="text-primary-pink">SALON</span>
                </h1>
                {/* Admin badge */}
                <span className="flex items-center gap-1 bg-primary-pink/15 border border-primary-pink/40 text-primary-pink text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                  <ShieldCheck size={10} />
                  Admin
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex space-x-1 items-center"
              ref={dropdownRef}
            >
              {adminSections.map((section) =>
                section.children ? (
                  <div key={section.name} className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === section.name ? null : section.name,
                        )
                      }
                      className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                        openDropdown === section.name
                          ? "text-primary-pink bg-primary-pink/10"
                          : "text-slate-300 hover:text-primary-pink hover:bg-primary-pink/10"
                      }`}
                    >
                      {section.icon}
                      {section.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          openDropdown === section.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openDropdown === section.name && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-background-dark rounded-xl shadow-xl border border-primary-pink/25 overflow-hidden z-50">
                        {section.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={() => setOpenDropdown(null)}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                                isActive
                                  ? "text-primary-pink bg-primary-pink/10 underline"
                                  : "text-slate-300 hover:text-primary-pink hover:bg-primary-pink/10"
                              }`
                            }
                          >
                            {child.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={section.path}
                    to={section.path!}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "text-primary-pink bg-primary-pink/10 underline"
                          : "text-slate-300 hover:text-primary-pink hover:bg-primary-pink/10"
                      }`
                    }
                  >
                    {section.icon}
                    {section.name}
                  </NavLink>
                ),
              )}

              {/* Divider */}
              <div className="w-px h-6 bg-primary-pink/20 mx-2" />

              {/* Sign out */}
              <button
                onClick={() => navigate("/logout")}
                className="cursor-pointer border border-primary-pink/40 text-primary-pink px-5 py-2 rounded-full font-bold text-sm transition-all hover:bg-primary-pink hover:text-slate-900 shadow-sm"
              >
                Sign Out
              </button>
            </nav>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-slate-300 hover:text-primary-pink transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-background-dark shadow-2xl
          flex flex-col md:hidden border-l border-primary-pink/20
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-6 border-b border-primary-pink/20">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary-pink" />
            <span className="text-primary-pink font-bold text-sm uppercase tracking-widest">
              Admin Panel
            </span>
          </div>
          <button
            className="p-1.5 text-slate-400 hover:text-primary-pink transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div className="flex flex-col justify-between h-full overflow-y-auto">
          <nav className="flex flex-col gap-1 p-4">
            {adminSections.map((section) =>
              section.children ? (
                <div key={section.name} className="flex flex-col gap-1">
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === section.name ? null : section.name,
                      )
                    }
                    className="flex items-center justify-between w-full px-4 py-3 text-slate-200 font-semibold text-sm rounded-lg hover:bg-primary-pink/10 hover:text-primary-pink transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {section.icon}
                      {section.name}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openDropdown === section.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === section.name && (
                    <div className="flex flex-col gap-1 pl-4 border-l-2 border-primary-pink/30 ml-4">
                      {section.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                              isActive
                                ? "text-primary-pink bg-primary-pink/10 font-bold"
                                : "text-slate-400 hover:text-primary-pink hover:bg-primary-pink/10"
                            }`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={section.path}
                  to={section.path!}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                      isActive
                        ? "text-primary-pink bg-primary-pink/10 font-bold"
                        : "text-slate-300 hover:text-primary-pink hover:bg-primary-pink/10"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {section.icon}
                  {section.name}
                </NavLink>
              ),
            )}
          </nav>

          {/* Sign Out */}
          <div className="p-6 border-t border-primary-pink/20">
            <button
              onClick={() => navigate("/logout")}
              className="w-full border border-primary-pink/40 text-primary-pink px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:bg-primary-pink hover:text-slate-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
