import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Login = () => {

  const [state, setState] = useState("login");

  // separate states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { axios, setToken } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = state === "login"
      ? "/api/user/login"
      : "/api/user/register";

    try {

      const { data } = await axios.post(url, {
        name,
        email,
        password
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:w-87.5 w-full text-center bg-gray-900 border border-gray-800 rounded-2xl px-8"
    >
      <h1 className="text-white text-3xl mt-10 font-medium">
        {state === "login" ? "Login" : "Sign up"}
      </h1>

      <p className="text-gray-400 text-sm mt-2">
        Please sign in to continue
      </p>

      {state !== "login" && (
        <div className="flex items-center mt-6 w-full bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

      <div className="flex items-center w-full mt-4 bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="email"
          placeholder="Email id"
          className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center mt-4 w-full bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full h-11 rounded-full text-white bg-gradient-to-r from-[#6366F1] to-[#22C55E] cursor-pointer"
      >
        {state === "login" ? "Login" : "Sign up"}
      </button>

      <p
        onClick={() =>
          setState(prev => prev === "login" ? "register" : "login")
        }
        className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer"
      >
        {state === "login"
          ? "Don't have an account?"
          : "Already have an account?"}

        <span className="text-emerald-400 ml-1">
          click here
        </span>
      </p>

    </form>
  );
};

export default Login;