import { Outlet } from "react-router";

export default function LoginLayout() {
  return (
    <>
      <div className="bg-background-soft-white flex items-center justify-center min-h-screen p-4">
        <Outlet />
      </div>
    </>
  );
}
