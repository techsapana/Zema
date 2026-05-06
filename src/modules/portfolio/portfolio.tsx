import { useQuery } from "@tanstack/react-query";
import {
  getGalleryApi,
  type GalleryItem,
} from "../../api/galleryAndReviewApi";
import { Loader2, EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router";

export default function Portfolio() {
  const navigate = useNavigate();
  const {
    data: galleries,
    isLoading,
    isError,
    error,
  } = useQuery<GalleryItem[]>({
    queryKey: ["galleries"],
    queryFn: getGalleryApi,
  });
  const portfolioGalleries = galleries?.filter(
    (g) => !g.isCommunityGallery && !g.isAcademyGallery,
  );

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-primary-pink font-bold tracking-widest text-xs uppercase mb-3 block">
                Artistry in Motion
              </span>
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6">
                Our Work <br />
                <span className="text-primary-pink">Showcase</span>
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed">
                A curated collection of our favorite transformations. From
                subtle enhancements to bold style shifts, every look is crafted
                to celebrate your unique beauty.
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
              <p className="text-slate-500">Loading gallery...</p>
            </div>
          )}

          {isError && (
            <div className="rounded-lg bg-red-50 p-8 text-center text-red-600">
              <p>Error loading gallery: {(error as Error).message}</p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            (!portfolioGalleries || portfolioGalleries.length === 0) && (
              <p className="text-primary-pink text-2xl text-center font-extrabold">
                There are no pictures at the moment.
              </p>
            )}

          {!isLoading &&
            !isError &&
            portfolioGalleries &&
            portfolioGalleries.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolioGalleries.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-2xl overflow-hidden bg-slate-200 group relative"
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            )}
        </section>
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Transformation Stories</h2>
            <div className="w-24 h-1 bg-primary-pink mx-auto"></div>
            <p className="mt-6 text-slate-600 max-w-xl mx-auto">
              See the journey from hair distress to hair success through our
              detailed before-and-after studies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* <!-- Case Study 1 --> */}
            <div className="bg-white p-8 rounded-2xl border border-primary-pink/10 shadow-xl shadow-primary-pink/5">
              <div className="relative grid grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden">
                <div className="relative group">
                  <img
                    className="w-full h-64 object-cover"
                    data-alt="Damaged dry hair before salon treatment"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ5nVjLzXK42iCvQ0B4XzwsgKX8B-qU6v09XWKYqTEK2_U6XJOUSO1dd8pbD04Mhm9eiKSdO2wA0zWhdzSLAhcPT_Va6yB7ufomAF0lDcfPGhUrJRX3NjpYp3_rZ7H9_8ni-NDKnA-s1v87FI_V2eVjhxOJlyHxlCzwNxx4dRy1NKjBT9b6A0GupevRY16vkGxx8i20eEONsC2PqpZ6JO98fK6zoFNnhkAYu3bbdgooP6AlohkttVaKCWaMtl_T7aEH_Qc8HBBKgk"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
                    Before
                  </div>
                </div>
                <div className="relative group">
                  <img
                    className="w-full h-64 object-cover"
                    data-alt="Shiny healthy hair after salon treatment"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCviT_ciuecstpk89y6Qe8OglpjqZuKHid_oD04UQs-py-xVo7DmlzuYfkTyvyIf7gRMyBGewerFt24UmS4CyFiRt406Tr74D0jF7XVXXrMIrcP0PMlcOTkhdT-jdkYT8AFZUq-H_wrt9Vw3jo3nSsMB2qLCnJaHAcm97c8IUmjMfclom4eQxSmwujod6M-G2LkOGAQPbPgRliSdx1seZzlkUndksYRzD9No41j0ckzCY7KD74dWYiF_zjMbnQp44_D1SSxOZ3nNU0"
                  />
                  <div className="absolute top-4 right-4 bg-primary-pink text-slate-900 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
                    After
                  </div>
                </div>
                <div className="absolute inset-y-0 left-1/2 -ml-px w-0.5 bg-white z-30">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <EllipsisVertical />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">The Hydration Revival</h3>
              <p className="text-slate-600 mb-6 italic text-sm">
                "I didn't think my hair could ever shine again after years of
                bleaching. The treatment at Luxe Salon was nothing short of a
                miracle."
              </p>
              <div className="flex items-center gap-4 border-t border-primary-pink/10 pt-6">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Stylist
                  </p>
                  <p className="font-semibold">Elena Vance</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Service
                  </p>
                  <p className="font-semibold">Kerasilk Keratin Treatment</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-primary-pink/10 shadow-xl shadow-primary-pink/5">
              <div className="relative grid grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden">
                <div className="relative group">
                  <img
                    className="w-full h-64 object-cover"
                    data-alt="Dull flat brown hair before color"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiKF_IBhaKVHYDcmfAY2flAcMiMyHDtBaAYhj7lVYEaUEOu28IggiBkFMfgAfms0DM8Ehpwgwj1X_nD-80FUSJBEitsqtaK4mh8rns4IZ4MPI75As8eqQyVmjFgf7s4-cb0crBNaNhcRnlXSGSh1XXMDEp1mwr75k2-6jVWS04VYcQxWlfzsed-QiokbguFH_xtjOj_Q7zL7GLgTR9btiqGSwJND359rMAS5s8m9AadP3aEAKDmBaigHbaJbfZYMVEjYOFnVqiPZk"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
                    Before
                  </div>
                </div>
                <div className="relative group">
                  <img
                    className="w-full h-64 object-cover"
                    data-alt="Vibrant multi-dimensional color after salon visit"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCnF7Di317EU2IY4TVPd1woDsgQhPYutS6W1xAeYECDljh56MSibQyzBXtEfPdbzpAbXPwDXPtnsC5Pf0X3Qd09bN2q8c7WSJ5Hj7syP_ZzZJZgKt7ZDQagUlTrPZoBbIRsQrNdZFbJvUfDk1MvV0Nv01GIQjjWO1fQu4gDVjzNRKYv_bokGViucg9ziI_IoFw39sIZQQPaS-PJrgNqVLaZdWOYASWSd504S-EIWXTK_0JvuQxDwEYPHJeIz60-HPpr0uoBz8UTUY"
                  />
                  <div className="absolute top-4 right-4 bg-primary-pink text-slate-900 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
                    After
                  </div>
                </div>
                <div className="absolute inset-y-0 left-1/2 -ml-px w-0.5 bg-white z-30">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <EllipsisVertical />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Color Correction Journey
              </h3>
              <p className="text-slate-600 mb-6 italic text-sm">
                "We went from patchy DIY color to this stunning,
                multi-dimensional blonde. It took two sessions but the result is
                exactly what I wanted."
              </p>
              <div className="flex items-center gap-4 border-t border-primary-pink/10 pt-6">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Stylist
                  </p>
                  <p className="font-semibold">Marcus Chen</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Service
                  </p>
                  <p className="font-semibold">Full Balayage &amp; Toning</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="mb-20 py-16 bg-primary-pink/10 rounded-3xl px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
              <div>
                <Quote size={35} className="stroke-none fill-primary-pink" />
              </div>
              <h2 className="text-3xl font-black mb-4">Client Results</h2>
              <p className="text-slate-600">
                What our clients say about their new looks.
              </p>
            </div>

            {isReviewsLoading && (
              <div className="flex h-32 flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
                <p className="text-slate-500">Loading reviews...</p>
              </div>
            )}

            {isReviewsError && (
              <div className="rounded-lg bg-red-50 p-8 text-center text-red-600">
                <p>Error loading reviews: {(reviewsError as Error).message}</p>
              </div>
            )}

            {!isReviewsLoading &&
              !isReviewsError &&
              (!reviews || reviews.length === 0) && (
                <p className="text-primary-pink text-xl text-center font-extrabold">
                  No reviews yet.
                </p>
              )}

            {!isReviewsLoading &&
              !isReviewsError &&
              reviews &&
              reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white p-6 rounded-xl shadow-sm"
                    >
                      <p className="text-sm leading-relaxed mb-6 text-slate-700 italic">
                        "{review.message}"
                      </p>
                      <div className="flex items-center gap-3 border-t border-primary-pink/10 pt-4">
                        <div className="size-10 rounded-full bg-primary-pink/30 flex items-center justify-center font-bold text-xs">
                          {review.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{review.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </section> */}
        <section className="relative h-80 rounded-3xl overflow-hidden flex items-center justify-center text-center p-6">
          <div className="absolute inset-0 bg-primary-pink/40 backdrop-blur-sm z-10"></div>
          <img
            className="absolute inset-0 w-full h-full object-cover"
            data-alt="Blurry interior of high-end salon"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY9ORi-IeMsxIEntqmghh2tA0tsprJcZrDcxGcYOgS5GHvl73PSihEOQ53YhiOz4lmW3_1wLoa4ZejLXWhThUltxm2puuHIodJF3wHsbFoq0Qs0h8mf98y4-99K0_5I3wupFAIFz4vuM_aCUzIfe7xWLIqfseeRGtj0p8Xuwpb6j9tjkfjAXLc2miwkDbz0h8q9cffm7XA-qAJyrS2LQTiYNat-fF2NL_dj7OB3iHWUvYP-7PA8_r3faPsL9VnbXOwS0laq-ZUYBw"
          />
          <div className="relative z-20 max-w-lg">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Ready for your own <br />
              transformation?
            </h2>
            <button
              onClick={() => navigate("/bookAppointment")}
              className="bg-slate-900 text-white px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-slate-900/20"
            >
              Book Your Session
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
