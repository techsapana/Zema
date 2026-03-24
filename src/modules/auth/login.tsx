import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useState } from "react";

type Inputs = {
  username: string;
  password: string;
};

export default function LogIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      await login(data);
      console.log("you are logged in ");
      toast.success("Login successful!", {
        style: {
          background: "#059669",
          color: "#fff",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#059669",
        },
      });
      navigate("/gallery");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.", {
        style: {
          background: "#ff4d4f",
          color: "#fff",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff4d4f",
        },
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <main className="w-full max-w-md">
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10"
          data-purpose="login-card"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome Back Admin
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Please enter your details to sign in
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="name"
                className="block w-full px-4 py-3 rounded-lg border-gray-300 border-2 outline-none focus:border-primary-redwood  text-gray-900 text-sm transition-colors"
                {...register("username", {
                  required: "Username is Required",
                })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm text-center mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <input
                className="block w-full px-4 py-3 rounded-lg border-gray-300 border-2 outline-none focus:border-primary-redwood text-gray-900 text-sm transition-colors"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                type="password"
              />

              {errors.password && (
                <p className="text-red-500 text-sm text-center mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="pt-2">
              <button
                className=" cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 active:scale-75  transition-all duration-200 disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
