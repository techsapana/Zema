import { useQuery } from "@tanstack/react-query";
import { getTeamMembersApi, type TeamMember } from "../../api/teamApi";
import { Users, Eye, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

export default function About() {
  const navigate = useNavigate();
  const { data: members, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["publicTeam"],
    queryFn: async () => {
      const res = await getTeamMembersApi();
      return res.data;
    },
  });

  return (
    <>
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex flex-col items-center">
            <div className="w-full max-w-300 px-6 py-12">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                <div className="flex flex-col gap-6">
                  {/* <span className="text-primary-pink font-bold uppercase tracking-widest text-sm">
                    Since 2010
                  </span> */}
                  <h1 className="text-4xl md:text-5xl font-black leading-tight text-slate-900 ">
                    Elegance meets excellence in beauty care.
                  </h1>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Zema Salon Pvt Ltd is one of the best-reviewed beauty and
                    nail salons in Boudha, Kathmandu. We specialize in
                    professional nail services including gel nails, nail
                    extensions, manicures, pedicures, and custom nail art, using
                    high-quality products with strict hygiene standards. Our
                    experienced technicians are professionally trained, and we
                    are also proud to run a nail and beauty academy, ensuring
                    expert-level service for every client. Known for our clean
                    environment, friendly service, and long-lasting results.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate("/bookAppointment")}
                      className="bg-primary-pink text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                      Book Appointment
                    </button>
                    {/* <button className="border-2 border-primary-pink text-primary-pink px-8 py-3 rounded-lg font-bold hover:bg-primary-pink/10 transition-colors">
                      Our Services
                    </button> */}
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-primary-pink/20 rounded-xl -rotate-2 group-hover:rotate-0 transition-transform"></div>
                  <div
                    className="relative h-100 w-full rounded-xl bg-cover bg-center overflow-hidden"
                    data-alt="Elegant luxury salon interior with flowers"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9aRRElQ7ZDB42lKfYuvNPcVtbeIVfRh9vpIQC2ZL6kHyzTvKPM3F5kE7nGhbrfRr6xPrqHyfaXDvgBOKaBPd6S89lGRS_Qo4x5d0hxN4Crf4-LlJpO_m1s5seRggggF_2eRMaGPApvA3uf1Xc5wmqPkWEmGgMy_OJeKGTcj5eZd7eKvbmvU585-mquJd88FLE-zlHNtxbNT2_HzSQ9LXlXo8oRDca_tvUUM-ocxVeKKiRjouShLezbnF3e0ub_5tbRe0MzuwCv4A'`,
                    }}
                  ></div>
                </div>
              </section>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                <div className="p-8 rounded-xl bg-primary-pink/10 border border-primary-pink/20 flex flex-col gap-4">
                  <Eye />
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                  <p className="text-slate-600 ">
                    To be the global benchmark for luxury beauty experiences,
                    where every client leaves feeling empowered, refreshed, and
                    radiantly confident.
                  </p>
                </div>
                <div className="p-8 rounded-xl bg-primary-pink/10 border border-primary-pink/20 flex flex-col gap-4">
                  <Sparkles />
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                  <p className="text-slate-600 ">
                    To provide exceptional beauty services using sustainable
                    products and innovative techniques, while fostering an
                    atmosphere of warmth and professional care.
                  </p>
                </div>
              </section>

              {/* ── Team Section (API-driven) ── */}
              <section className="mb-24">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">
                    The Creative Minds
                  </h2>
                  <p className="text-slate-600 max-w-2xl mx-auto">
                    Our team of master stylists and therapists bring decades of
                    collective experience to your beauty journey.
                  </p>
                </div>

                {/* Loading skeletons */}
                {isLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-4 animate-pulse"
                      >
                        <div className="aspect-3/4 rounded-xl bg-slate-200" />
                        <div className="text-center space-y-2">
                          <div className="h-5 w-28 bg-slate-200 rounded-full mx-auto" />
                          <div className="h-4 w-36 bg-slate-200 rounded-full mx-auto" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {!isLoading && members && members.length === 0 && (
                  <div className="rounded-xl bg-primary-pink/5 p-16 text-center">
                    <Users
                      size={40}
                      className="text-primary-pink/40 mx-auto mb-3"
                    />
                    <p className="text-slate-400">
                      Our team is growing — check back soon!
                    </p>
                  </div>
                )}

                {/* Team cards */}
                {members && members.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex flex-col gap-4 group"
                      >
                        <div className="aspect-3/4 rounded-xl overflow-hidden bg-slate-100">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users size={32} className="text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <h4 className="font-bold text-lg">{member.name}</h4>
                          <p className="text-primary-pink font-medium">
                            {member.role}
                          </p>
                          {/* {member.description && (
                            <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                              {member.description}
                            </p>
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
