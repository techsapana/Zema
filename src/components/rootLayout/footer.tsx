import { MapPin, Phone, Mail } from "lucide-react";

export default function RootFooter() {
  return (
    <>
      <footer className="bg-primary-pink/10 border-t border-primary-pink/20 py-12 px-6 lg:px-40">
        <div className="max-w-300 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary-pink">
              <h4 className="font-bold text-lg text-slate-900 ">zema salon</h4>
            </div>
            <p className="text-sm text-slate-600 ">
              Defining elegance and beauty. Your sanctuary for premium hair and
              skin care.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>
                <a className="hover:text-primary-pink" href="about">
                  About Us
                </a>
              </li>
              <li>
                <a className="hover:text-primary-pink" href="portfolio">
                  Portfolio
                </a>
              </li>
              <li>
                <a className="hover:text-primary-pink" href="bookAppointment">
                  Book Now
                </a>
              </li>
              <li>
                <a className="hover:text-primary-pink" href="contacts">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <MapPin />
                Bhumi, dharatole, Kathmandu 44600
              </li>
              <li className="flex items-center gap-2">
                <Phone />
                970-7728098
              </li>
              <li className="flex items-center gap-2">
                <Mail />
                info@zemasaloon@gmail.com
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                aria-label="Instagram"
                className="size-10 rounded-full bg-white  border border-stone-200  flex items-center justify-center text-slate-600  "
                href="https://www.instagram.com/zema_salon?igsh=MWE1NmM4cXFheGlnZA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>

              <a
                aria-label="YouTube"
                className="size-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-slate-600"
                href="https://youtube.com/@zemasalon?si=Pm5UodgCl3IRAYG4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                aria-label="TikTok"
                className="size-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-slate-600"
                href="https://www.tiktok.com/@zema.salon?_r=1&_t=ZS-96NNoGDMDJQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-pink/20 text-center text-xs text-slate-500">
          © 2026 Zema Salon. All rights reserved.
        </div>
      </footer>
    </>
  );
}
