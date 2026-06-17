"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
  Shield,
  Wifi,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import api, { loginUser } from "@/services/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "./schema";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(data);
      const token = res.data.access_token;
      const user = res.data.user || {
        username: data.username,
        role: "USER",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(token, user);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#0F1412]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div
            className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-5"
            style={{
              background:
                "radial-gradient(circle, #81C784 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-32 right-10 w-96 h-96 rounded-full opacity-5"
            style={{
              background:
                "radial-gradient(circle, #2E7D32 0%, transparent 70%)",
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#81C784 1px, transparent 1px), linear-gradient(90deg, #81C784 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1B231E, #2E3D36)",
                border: "2px solid rgba(129,199,132,0.3)",
              }}
            >
              <Shield className="w-8 h-8" style={{ color: "#81C784" }} />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white">
                Ele<span style={{ color: "#81C784" }}>Guard</span>{" "}
                <span style={{ color: "#A5D6A7", fontSize: "0.8em" }}>LK</span>
              </div>
              <div
                className="text-xs tracking-widest"
                style={{ color: "#5F6B63" }}
              >
                PROTECTING FARMS, PRESERVING WILDLIFE
              </div>
            </div>
          </div>

          <h1 className="font-display text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Elephant Detect</span>
            <br />
            <span style={{ color: "#81C784" }}>System</span>
          </h1>

          <p
            className="text-lg mb-10 leading-relaxed"
            style={{ color: "#B0BEC5" }}
          >
            Protecting Farmers from Human-Elephant Conflict — early detection,
            instant alerts, and a safer tomorrow for farmers and wildlife.
          </p>

          <div className="space-y-4">
            {[
              { icon: Wifi, text: "Real-time geophone-powered alerts" },
              { icon: MapPin, text: "Field mapping & sensor monitoring" },
              { icon: Shield, text: "AI-powered threat prediction" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(129,199,132,0.15)",
                    border: "1px solid rgba(129,199,132,0.3)",
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#81C784" }} />
                </div>
                <span style={{ color: "#E8F5E9" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div
            className="rounded-3xl p-8 shadow-2xl"
            style={{
              background: "rgba(27,35,30,0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(129,199,132,0.15)",
            }}
          >
            {/* Tabs */}
            <div
              className="flex rounded-2xl p-1 mb-8"
              style={{ background: "rgba(15,20,18,0.8)" }}
            >
              {["login", "register"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-3 rounded-xl font-display font-semibold text-sm uppercase tracking-widest transition-all duration-300"
                  style={
                    tab === t
                      ? {
                          background: "#2E7D32",
                          color: "#E8F5E9",
                          boxShadow: "0 4px 15px rgba(46,125,50,0.4)",
                        }
                      : { color: "#5F6B63" }
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#A5D6A7" }}
                >
                  Username
                </label>
                <div className="relative">
                  <UserIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#5F6B63" }}
                  />
                  <input
                    type="text"
                    {...register("username")}
                    placeholder="your.username"
                    className="w-full pl-11 pr-4 py-4 rounded-xl text-sm transition-all duration-200"
                    style={{
                      background: "rgba(15,20,18,0.8)",
                      border: "1px solid rgba(129,199,132,0.2)",
                      color: "#E8F5E9",
                    }}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm" style={{ color: "#EF5350" }}>
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#A5D6A7" }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#5F6B63" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-4 rounded-xl text-sm transition-all duration-200"
                    style={{
                      background: "rgba(15,20,18,0.8)",
                      border: "1px solid rgba(129,199,132,0.2)",
                      color: "#E8F5E9",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#5F6B63" }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm" style={{ color: "#EF5350" }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl text-sm"
                  style={{
                    background: "rgba(239,83,80,0.1)",
                    border: "1px solid rgba(239,83,80,0.3)",
                    color: "#EF5350",
                  }}
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-widest transition-all duration-300 mt-2"
                style={{
                  background: loading
                    ? "rgba(46,125,50,0.5)"
                    : "linear-gradient(135deg, #2E7D32, #388E3C)",
                  color: "#E8F5E9",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 20px rgba(46,125,50,0.4)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: "#81C784" }}
                >
                  Forgot Password?
                </button>
              </div>
            </form>

            <div
              className="mt-8 pt-6 text-center text-xs"
              style={{
                color: "#3D4F44",
                borderTop: "1px solid rgba(129,199,132,0.1)",
              }}
            >
              © 2026 EleGuard LK · Protecting Farms, Preserving Wildlife
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
