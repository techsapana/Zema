import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { X, ChevronDown, Menu, ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

const navLinks: { name: string; path: string }[] = [
  { name: "AboutUs", path: "/about" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Products", path: "/products" },
  { name: "Community", path: "/community" },
  { name: "Contact", path: "/contacts" },
];

const academyLinks: { name: string; path: string }[] = [
  { name: "Gallery", path: "/academy/gallery" },
  { name: "Courses", path: "/academy/courses" },
  { name: "Instructors", path: "/academy/instructors" },
];

export default function RootHeader() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isMobileAcademyOpen, setIsMobileAcademyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { items } = useCartStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsAcademyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-primary-pink/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              className=" cursor-pointer flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                ZEMA <span className="text-primary-pink">SALON</span>
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-primary-pink underline"
                        : "hover:text-primary-pink"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsAcademyOpen((prev) => !prev)}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary-pink ${
                    isAcademyOpen ? "text-primary-pink" : ""
                  }`}
                >
                  Academy
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isAcademyOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isAcademyOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-40 bg-white rounded-xl shadow-lg border border-primary-pink/20 overflow-hidden z-50">
                    {academyLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsAcademyOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 text-sm font-semibold transition-colors ${
                            isActive
                              ? "text-primary-pink bg-primary-pink/10 underline"
                              : "text-slate-700 hover:text-primary-pink hover:bg-primary-pink/10"
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/bookAppointment")}
                className="cursor-pointer bg-primary-pink text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm"
              >
                Book Appointment
              </button>

              <button 
                onClick={() => navigate("/products/cart")} 
                className="relative p-2 text-slate-700 hover:text-primary-pink transition-colors cursor-pointer"
                title="View Cart"
              >
                <ShoppingCart size={22} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-pink text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {items.length}
                  </span>
                )}
              </button>
            </nav>

            <div className="flex items-center gap-4 md:hidden">
              <button 
                onClick={() => navigate("/products/cart")} 
                className="relative p-2 text-slate-700 hover:text-primary-pink transition-colors cursor-pointer"
              >
                <ShoppingCart size={22} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-pink text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {items.length}
                  </span>
                )}
              </button>
              <button
                className="p-2"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-primary-pink shadow-xl
          flex flex-col md:hidden
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-6">
          <button
            className="p-2 text-slate-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={28} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div className="flex flex-col justify-between h-full">
          <nav className="flex flex-col gap-6 px-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors text-slate-900 ${
                    isActive ? "underline font-bold" : "hover:opacity-70"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile Academy Accordion */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsMobileAcademyOpen((prev) => !prev)}
                className="flex items-center justify-between text-lg font-medium text-slate-900 hover:opacity-70 transition-colors"
              >
                Academy
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    isMobileAcademyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMobileAcademyOpen && (
                <div className="flex flex-col gap-3 pl-4 border-l-2 border-slate-900/30">
                  {academyLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `text-base font-medium transition-colors text-slate-900 ${
                          isActive ? "underline font-bold" : "hover:opacity-70"
                        }`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="p-6">
            <button
              onClick={() => navigate("/bookAppointment")}
              className="w-full cursor-pointer bg-slate-900 text-primary-pink px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
