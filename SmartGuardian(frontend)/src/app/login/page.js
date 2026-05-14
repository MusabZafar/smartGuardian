"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, oauth2Login } from "../api/LoginRegistrationService";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showErrorModal, setShowErrorModal] = useState(false); // State to show or hide error modal
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password regex validation for length 5-10, one uppercase letter, one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{5,10})/;

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be 5-10 characters long, include at least one uppercase letter and one special character."
      );
      setShowErrorModal(true); // Show modal on error
      return;
    }

    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.accessToken);
      console.log(data.accessToken);
      alert("Login successful!");
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setError(error.message);
      setShowErrorModal(true); // Show modal on other errors
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    console.log(
      "Redirecting to: ",
      `http://localhost:8080/oauth2/authorization/${provider}`
    );
  };

  return (
    <div className="h-screen md:flex">
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            Smart Guardian
          </h1>
          <p className="text-white mt-1">
            Grow Your Business With Smart Guardian
          </p>
          <button
            type="button"
            className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2"
          >
            <Link href="/register">Register</Link>
          </button>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>

      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <div className="bg-white">
          <h1 className="text-gray-800 font-bold text-2xl mb-1">
            Welcome Back!
          </h1>
          <p className="text-sm font-normal text-gray-600 mb-7">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
              <input
                className="pl-2 outline-none border-none w-full"
                type="text"
                name="usernameOrEmail"
                placeholder="Username or Email"
                value={formData.usernameOrEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl relative">
              <input
                className="pl-2 outline-none border-none w-full"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                name="password"
                placeholder="Password"
                maxLength={10}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 text-[13px] text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
            >
              Login
            </button>
          </form>

          <div className="mt-6">
            <button className="text-blue-600">
              <Link href="/RequestReset">Forgot Password?</Link>
            </button>
          </div>

          <div className="mt-8 grid space-y-4">
            <p className="text-gray-600 md:ml-[70px]">or continue with</p>
            <button
              onClick={() => handleOAuthLogin("google")}
              className="group h-12 px-6 border-2 border-gray-300 transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
            >
<div className="relative flex items-center space-x-4 justify-center">
  <img
    src="/google.svg"  // path to your image in the public folder
    className="absolute left-0 w-5 h-5"  // width and height set to 5 for consistency
    alt="Google logo"
  />
  <span className="font-semibold text-gray-700 group-hover:text-blue-600">
    Continue with Google
  </span>
</div>


            </button>

            <button
              onClick={() => handleOAuthLogin("github")}
              className="group h-12 px-6 border-2 border-gray-300 transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
            >
              <div className="relative flex items-center space-x-4 justify-center">
                <svg
                  className="absolute left-0 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-blue-600">
                  Continue with GitHub
                </span>
              </div>
            </button>

            <button
              onClick={() => handleOAuthLogin("facebook")}
              className="group h-12 px-6 border-2 border-gray-300 transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
            >
              <div className="relative flex items-center space-x-4 justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"
                  className="absolute left-0 w-5"
                  alt="Facebook logo"
                />
                <span className="font-semibold text-gray-700 group-hover:text-blue-600">
                  Continue with Facebook
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
