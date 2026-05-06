import RootHeader from "../components/rootLayout/header";
import RootFooter from "../components/rootLayout/footer";
import { Outlet } from "react-router";
import WhatsAppButton from "../components/projectComponents/WhatsAppButton";

export default function RootLayout() {
  return (
    <>
      <div className="bg-background-light text-slate-900 transition-colors duration-300">
        <RootHeader />
        <Outlet />
        <RootFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}
