import { createBrowserRouter } from "react-router";
import RootLayout from "./rootLayout";
import Home from "../modules/home/home";
import About from "../modules/about/about";
import Portfolio from "../modules/portfolio/portfolio";
import Contact from "../modules/contact/contact";
import Appointment from "../modules/bookAppointment/appointment";
import ReviewsPage from "../modules/review/userReview";
import CommunityPage from "../modules/community/community";
import CommunityEventPage from "../modules/community/communityEventPage";
import AcademyGallerySection from "../modules/academy/gallery";
import AcademyCoursesSection from "../modules/academy/courses";
import CourseInfoPage from "../modules/academy/coursesInfo";
import InstructorsSection from "../modules/academy/instructor";
import LoginLayout from "./loginLayout";
import LogIn from "../modules/auth/login";
import AdminLayout from "./adminLayout";
import AdminGallery from "../modules/admin/adminGallery";
import AdminReviews from "../modules/admin/adminReview";
import AdminCommunity from "../modules/admin/adminCommunity";
import AdminCourse from "../modules/admin/adminCourse";
import AdminInstructor from "../modules/admin/adminInstructor";
import AdminAppointment from "../modules/admin/adminAppointment";
import AdminEnrollment from "../modules/admin/adminEnrollment";
import AdminTeam from "../modules/admin/adminTeam";
import AdminSlots from "../modules/admin/adminSlots";
import AdminServices from "../modules/admin/adminServices";
import AdminProducts from "../modules/admin/adminProducts";
import AdminOrders from "../modules/admin/adminOrders";
import AdminSettings from "../modules/admin/adminSettings";
import Products from "../modules/products/products";
import ProductInfoPage from "../modules/products/productInfo";
import CartPage from "../modules/products/CartPage";
import Enroll from "../modules/enroll/enroll";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "portfolio", element: <Portfolio /> },
      { path: "contacts", element: <Contact /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "bookAppointment", element: <Appointment /> },
      { path: "enroll", element: <Enroll /> },
      {
        path: "products",
        children: [
          { index: true, element: <Products /> },
          { path: ":id", element: <ProductInfoPage /> },
          { path: "cart", element: <CartPage /> },
        ],
      },

      {
        path: "community",
        children: [
          { index: true, element: <CommunityPage /> },
          { path: "events/:id", element: <CommunityEventPage /> },
        ],
      },
      {
        path: "academy",
        children: [
          {
            path: "gallery",
            element: <AcademyGallerySection />,
          },

          {
            path: "courses",
            children: [
              {
                index: true,
                element: <AcademyCoursesSection />,
              },
              {
                path: ":id",
                element: <CourseInfoPage />,
              },
            ],
          },
          {
            path: "instructors",
            element: <InstructorsSection />,
          },
        ],
      },
    ],
  },
  {
    Component: LoginLayout,
    children: [{ path: "/login", element: <LogIn /> }],
  },
  {
    Component: AdminLayout,
    children: [
      // {
      //   path: "dashboard",
      //   element: (
      //     <div className="p-6 md:p-8">
      //       <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      //       <p className="text-slate-500 text-sm mt-1">
      //         Welcome to the admin dashboard.
      //       </p>
      //     </div>
      //   ),
      // },
      {
        path: "gallery",
        element: <AdminGallery />,
      },
      {
        path: "reviews-admin",
        element: <AdminReviews />,
      },
      {
        path: "community-admin",
        element: <AdminCommunity />,
      },
      {
        path: "course-admin",
        element: <AdminCourse />,
      },
      {
        path: "instructor-admin",
        element: <AdminInstructor />,
      },
      {
        path: "appointment-admin",
        element: <AdminAppointment />,
      },
      {
        path: "enrollment-admin",
        element: <AdminEnrollment />,
      },
      {
        path: "team-admin",
        element: <AdminTeam />,
      },
      {
        path: "slots-admin",
        element: <AdminSlots />,
      },
      {
        path: "services-admin",
        element: <AdminServices />,
      },
      {
        path: "products-admin",
        element: <AdminProducts />,
      },
      {
        path: "orders-admin",
        element: <AdminOrders />,
      },
      {
        path: "settings-admin",
        element: <AdminSettings />,
      },
    ],
  },
]);
