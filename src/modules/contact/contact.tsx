import { MapPin, Phone, Mail, Clock, CornerDownRight } from "lucide-react";

export default function Contact() {
  return (
    <>
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex-1 flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full max-w-300 px-6 py-12 md:py-20 text-center">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                Get in Touch
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                We're here to help you look and feel your best. Reach out to
                book your next transformation or ask us anything.
              </p>
            </section>

            <div className="w-full max-w-300 px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-5 p-5 bg-primary-pink-lighter rounded-xl border border-primary-pink/20">
                  <div className="size-12 rounded-full bg-primary-pink flex items-center justify-center text-white">
                    <Phone />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Call Us
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      9707728098
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-5 bg-primary-pink-lighter rounded-xl border border-primary-pink/20">
                  <div className="size-12 rounded-full bg-primary-pink flex items-center justify-center text-white">
                    <Mail />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Email Us
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      info@zemasalon@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-5 bg-primary-pink-lighter rounded-xl border border-primary-pink/20">
                  <div className="size-12 rounded-full bg-primary-pink flex items-center justify-center text-white">
                    <MapPin />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Visit Us
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      Boudha Bhumi, dharatole, Kathmandu 44600
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white p-6 rounded-xl border border-primary-pink/10 shadow-sm">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="text-primary-pink" />
                  Business Hours
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-4 py-3 rounded-lg border border-transparent hover:border-primary-pink/20 hover:bg-primary-pink-lighter hover:scale-[1.02] transition-all duration-200 cursor-default">
                    <span className="text-slate-600 font-medium">
                      Saturday–Sunday
                    </span>
                    <span className="font-bold text-slate-900">
                      10:00 AM – 7:00 PM
                    </span>
                  </div>

                  {/* <div className="flex justify-between items-center px-4 py-3 rounded-lg border border-transparent hover:border-primary-pink/20 hover:bg-primary-pink-lighter hover:scale-[1.02] transition-all duration-200 cursor-default">
                    <span className="text-slate-500 font-medium">Sunday</span>
                    <span className="font-semibold text-primary-pink">
                      Closed
                    </span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <section className="w-3/4 bg-primary-pink-light/30 py-16 flex justify-center">
              <div className="w-full max-w-300 px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      Find Us
                    </h3>
                    <p className="text-slate-600">
                      Located in the heart of the city's fashion district.
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm font-bold text-sm">
                    <CornerDownRight />
                    Get Directions
                  </button>
                </div>
                <div className="w-full h-110 rounded-2xl overflow-hidden shadow-2xl relative border-4 border-white">
                  <div className="w-full h-full lg:h-125 bg-slate-200 rounded-xl overflow-hidden shadow-sm relative group">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.8229725135793!2d85.36031299999999!3d27.722751599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b3a78bddd0f%3A0x7661253a6c0c8bff!2sZema%20Salon%20Pvt%20ltd!5e0!3m2!1sen!2snp!4v1774169857738!5m2!1sen!2snp"
                      width="600"
                      height="450"
                      style={{ border: 0 }}
                      loading="lazy"
                    ></iframe>
                    <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
