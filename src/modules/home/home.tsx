import {
  Scissors,
  Palette,
  Sparkles,
  GraduationCap,
  Heart,
} from "lucide-react";
import TestimonialsSection from "../../components/projectComponents/reviews";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getGalleryApi, type GalleryItem } from "../../api/galleryAndReviewApi";

export default function Home() {
  const navigate = useNavigate();

  // const { data: allGalleries, isLoading: galleryLoading } =
  //   useQuery<GalleryItem[]>({
  //     queryKey: ["homePortfolioGallery"],
  //     queryFn: getGalleryApi,
  //   });

  // const portfolioImages = allGalleries
  //   ?.filter((g) => !g.isCommunityGallery && !g.isAcademyGallery)
  //   .slice(0, 4);

  return (
    <>
      <main>
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="mb-12 lg:mb-0">
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary-pink/20 text-primary-pink rounded-full">
                  Premier Beauty Sanctuary
                </span>
                <h2 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8 text-slate-900 ">
                  Redefine Your <br />
                  <span className="text-primary-pink italic">
                    Signature Style
                  </span>
                </h2>
                <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                  Experience the intersection of luxury and artistry. Our master
                  stylists and estheticians craft personalized treatments
                  designed to elevate your natural radiance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("portfolio")}
                    className="bg-primary-pink text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow"
                  >
                    Our Portfolio
                  </button>
                  {/* <button className="border-2 border-primary-pink/30 hover:border-primary-pink text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
                    Explore Services
                  </button> */}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 bg-primary-pink/10">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="Elegant woman receiving a professional hair treatment"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHOy56wWSU4r0eQucEknrbGnzYuxffZLlVCi2vy25W9JC7eo7G_aP7ngY7KevEMCZky-lt8ACg4t4gFRReHC8kareZhOf3lmN9cFZW99KgsTbJNiswRWiErPA5C9yWbN0AUmeNwKRWs5w-HE3WR2vRcdOJPZIAZrXwMahrn-K6ZtIKy8Tk9gmjmejItjpqM8lbnb9pWxb6ZP76aUNAPasZkmohMcBZIxtk-VOWQNXnho3d9NjhgOPMsjgHcMyIzARpmsA9D2Qu6y8"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Brand Intro --> */}
        <section className="py-20 bg-primary-pink/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-6">The Standard</h3>
            <p className="text-xl text-slate-600 italic leading-loose">
              " Zema Salon Pvt Ltd is one of the best-reviewed beauty and nail
              salons in Boudha, Kathmandu. We specialize in professional nail
              services including gel nails, nail extensions, manicures,
              pedicures, and custom nail art, using high-quality products with
              strict hygiene standards. Our experienced technicians are
              professionally trained, and we are also proud to run a nail and
              beauty academy, ensuring expert-level service for every client.
              Known for our clean environment, friendly service, and
              long-lasting results"
            </p>
          </div>
        </section>
        {/* <!-- Featured Services --> */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-4xl font-black mb-4">
                  Our Specializations
                </h2>
                <p className="text-slate-600 ">
                  Tailored treatments for your hair, skin, and soul.
                </p>
              </div>
              <div className="text-primary-pink font-bold border-b-2 border-primary-pink pb-1">
                View All Services
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* <!-- Service 1 --> */}
              <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 ">
                <div className="w-14 h-14 bg-primary-pink/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-pink transition-colors">
                  <div className="text-primary-pink group-hover:text-white">
                    <Scissors />
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3">
                  Precision Haircutting
                </h4>
                <p className="text-slate-600 mb-6">
                  Expertly crafted silhouettes that complement your face shape
                  and lifestyle.
                </p>
                {/* <p className="font-bold text-primary-pink">Starting at $85</p> */}
              </div>
              {/* <!-- Service 2 --> */}
              <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 ">
                <div className="w-14 h-14 bg-primary-pink/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-pink transition-colors">
                  <div className="text-primary-pink group-hover:text-white">
                    <Palette />
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3">Artisanal Coloring</h4>
                <p className="text-slate-600 mb-6">
                  From sun-kissed balayage to bold transformations using
                  low-toxin formulas.
                </p>
                {/* <p className="font-bold text-primary-pink">Starting at $150</p> */}
              </div>
              {/* <!-- Service 3 --> */}
              <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 ">
                <div className="w-14 h-14 bg-primary-pink/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-pink transition-colors">
                  <div className="text-primary-pink group-hover:text-white">
                    <Sparkles />
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3">
                  Advanced Skin Therapy
                </h4>
                <p className="text-slate-600 mb-6">
                  Clinical-grade facials and rejuvenation treatments for lasting
                  luminosity.
                </p>
                {/* <p className="font-bold text-primary-pink">Starting at $120</p> */}
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Community & Academy Highlights --> */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-black mb-8 leading-tight">
                  Empowering the Next <br />
                  Generation of Stylists
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 bg-primary-pink/30 rounded-full flex items-center justify-center">
                      <div className="text-primary-pink ">
                        <GraduationCap />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Zema Academy</h4>
                      <p className="text-slate-400">
                        Intensive certification courses for aspiring stylists
                        looking to master high-end techniques.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 bg-primary-pink/30 rounded-full flex items-center justify-center">
                      <div className="text-primary-pink ">
                        <Heart />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">
                        Community Glow-Up
                      </h4>
                      <p className="text-slate-400">
                        Our monthly program providing complimentary styling
                        services to women re-entering the workforce.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/academy/courses")}
                  className="cursor-pointer mt-12 bg-primary-pink text-slate-900 px-8 py-3 rounded-lg font-bold"
                >
                  Enroll in Academy
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-3/4 rounded-2xl overflow-hidden mt-12">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="Stylists training in a classNameroom setting"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjb5-mP1QYtDvKwL7_qfi6sFdD7FYhd-aOtz7qIz5tk48p6OOKhz1wuiwMDiMn6zdCJhRQEhf5hOBleB6raBMMd21PD809-NmfNpLx9GzvGk870r2HglQ4jFCQBNh2b_qxg5weEfpHCzlfx-JfDukZih318yP5R4HNpGCaUuz4ynO9idt_y-kovIJJ7Y5ckJxJ2zky2aapk7XyEm3bM0IYq000gv4BTceU0VeUCfymaOjzhXvisAaNXlkfbZ-CijILeJrRAFcPMx4"
                  />
                </div>
                <div className="aspect-3/4 rounded-2xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="A clean modern salon interior"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD73y0IubDE8tQ9UvTCXeQfViterJKa21PwQSxH6uDSVTF4Re-h4fGEv3sp6BsqeZD2g9MocOmz1vmvT62uSB6xcUUv8KFCi97wRWvy2JR3oDQ3RRVsGFU1BTsVO-eDbROZpldyVMXNUWtosDYV-GWoJyqpogbpTs0b4yrCSgmzP_vcc5JoBZRpNe9ewZWyeHXzanFgfW8JEuC_ZVAovAT5VIHNoYTUBqzCTU8LZJNmW2rVjngarst4dScAfLQOo9QxD-5HTZhptnA"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Portfolio Preview --> */}
        {/* <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">The Portfolio</h2>
              <p className="text-slate-600 ">
                Real transformations, captured in-studio.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-slate-200 animate-pulse"
                  />
                ))}

              {portfolioImages && portfolioImages.length === 0 && (
                <p className="col-span-4 text-center text-primary-pink font-bold py-8">
                  No portfolio photos yet.
                </p>
              )}

              {portfolioImages &&
                portfolioImages.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-2xl overflow-hidden bg-slate-100 group"
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title || "Portfolio photo"}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                ))}
            </div>
          </div>
        </section> */}
        {/* <!-- Testimonials --> */}
        <TestimonialsSection />

        {/* <!-- Booking CTA Banner --> */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto rounded-[3rem] overflow-hidden relative">
            <div className="absolute inset-0 bg-primary-pink/90 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-linear-to-r from-primary-pink via-primary-pink/50 to-transparent"></div>
            <img
              className="absolute inset-0 w-full h-full object-cover"
              data-alt="Abstract soft pink and white wavy pattern"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX84pF5L0BB0hI8krBAHzsVbYkNCkFc-e5byw7-9kL2gtoxFwlxLaAH6NgnP55cqo-aMDe9eP72EMGZRJn0wqlS9fIFi57LxtZNj_7rEp2RFI4N79Xm8xEOlC_ddhAIA8ykAE65uLS4Nh-3IWp08TA6fy57qxFVWMRYQUQyULZWeX4qu561jvGtZNbzbewbZ-GYt8WNfX0_zEDUy8Aq2guK-rRUqSk8wtdnzaabT1pMq8w5LawsYZyZPBr-lpBeVr3jy3L5ROSXu8"
            />
            <div className="relative z-10 py-16 px-12 md:py-24 md:px-24 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 text-white">
                <h2 className="text-4xl md:text-5xl font-black mb-4">
                  Ready for your <br />
                  glow-up?
                </h2>
                <p className="text-xl font-medium opacity-90">
                  Secure your session with our master stylists today.
                </p>
              </div>
              <button
                onClick={() => navigate("/bookAppointment")}
                className=" cursor-pointer bg-white text-primary-pink px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl"
              >
                Book My Visit
              </button>
            </div>
          </div>
        </section>
        {/* <!-- Blog / News --> */}
        {/* <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black mb-12">
              Latest from the Studio
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <article className="group">
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-100">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    data-alt="Close up of high quality skincare products"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt_bKbPh1-CxkT8nh3SPIAOSlanu9Ew5mP30NNgZDXwyxi-ay7jxfjlX7snrkjf0F5XUKwNiiaDWwLpjyAMpiywrlHPe3PL1XHq-Z8JYLrme3_cLlYp-L9pBAWSllXK_kMmVlHmDG0gOhjZBmwU0qbKbv7eXVj_Y72Z-2uEVIdkrzDXIh7mgp--XUrNTwmk38fVNznjcASbCvfnedWp8W6gDlSd8KaeV6ylZCMQF8auFpz3lfIbiXJdGwd9XmwlM5hsaneYhLmGSE"
                  />
                </div>
                <span className="text-xs font-bold text-primary-pink uppercase tracking-widest">
                  Skincare
                </span>
                <h4 className="text-xl font-bold mt-2 mb-3">
                  5 Morning Habits for a Natural Glow
                </h4>
                <p className="text-slate-600 text-sm">
                  Discover our top-tier routine for keeping that post-facial
                  glow everyday...
                </p>
              </article>
              <article className="group">
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-100">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    data-alt="Model with professional hair styling"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8zJCVaytRrTsfb7hUPvDi0OXH_dvVpJepFXgpWyl-smbdbV0zo108dgXBdCh4cbubRKyWMsopG-4-3fZIPO5W5eCgia5nsdiyK6QFHJiC6sIwCd28ELA9-frQaIKqvzZgjWKbRLwqQCaM66kj3xcssZLXktXn3Tte_cYouQLjtvihP2D9fNn4jaPQYghNxtG28TcM5QSlOmQcYsT1lpuuW7ql2boKhu_3jrQyoEJGpwy_1-2ThmJNhUrGmQzfT5GcGAePkl0n7K4"
                  />
                </div>
                <span className="text-xs font-bold text-primary-pink uppercase tracking-widest">
                  Hair Trends
                </span>
                <h4 className="text-xl font-bold mt-2 mb-3">
                  The Return of the Italian Bob
                </h4>
                <p className="text-slate-600 text-sm">
                  Why this classNameic cut is taking over salons this autumn and
                  how to style it...
                </p>
              </article>
              <article className="group">
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-100">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    data-alt="Model with elegant makeup and jewelry"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb0pighlD3b156OBLXqDx_eotfk1ABSBVltDRABMb4tHPr5QNof-M6jeroZkDfVQQ1J8RC3o-jFI8QLxH13BA_FbZ92xS-_Oq1tSYTrhORkQti84LxtBjFsSzVAv_a268s-NaEIB5iBTYbwgZuIOosMWzcCWmyRX6Z2bv-0Nwg1k9ycN-_Peir5w871D2riZOj1ccGc5ahILPDi8gN-b77O_GVFUiQfAqMvRjcwVyyxkVhW7SRTbyW4daomACiucZ3lvJNFu-uxZw"
                  />
                </div>
                <span className="text-xs font-bold text-primary-pink uppercase tracking-widest">
                  Lifestyle
                </span>
                <h4 className="text-xl font-bold mt-2 mb-3">
                  Sustainable Beauty: Our Promise
                </h4>
                <p className="text-slate-600 text-sm">
                  Exploring our transition to 100% plastic-free packaging for
                  all in-house products...
                </p>
              </article>
            </div>
          </div>
        </section> */}
      </main>
    </>
  );
}
