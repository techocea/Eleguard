import { useAuth } from "@/hooks/use-auth";
import {
  Map,
  Brain,
  History,
  User,
  LogOut,
  Shield,
  Wifi,
  ChevronRight,
  ToggleRight,
} from "lucide-react";
import { router } from "next/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    icon: Map,
    label: "Heat Map",
    desc: "Live sensor monitoring",
  },
  {
    href: "/dashboard/sensors",
    icon: ToggleRight,
    label: "Sensor Controls",
    desc: "Manual sensor on/off",
  },
  {
    href: "/dashboard/prediction",
    icon: Brain,
    label: "AI Prediction",
    desc: "Threat forecasting",
  },
  {
    href: "/dashboard/history",
    icon: History,
    label: "History",
    desc: "Sensor event log",
  },
  { href: "profile", icon: User, label: "Profile", desc: "Account settings" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1B3A1F, #2E5D30)",
              border: "1px solid rgba(129,199,132,0.4)",
            }}
          >
            <Shield className="w-5 h-5" style={{ color: "#81C784" }} />
          </div>
          <div>
            <div
              className="font-display font-bold text-base leading-tight"
              style={{ color: "#E8F5E9" }}
            >
              Ele<span style={{ color: "#81C784" }}>Guard</span>{" "}
              <span style={{ color: "#A5D6A7", fontSize: "0.75em" }}>LK</span>
            </div>
            <div
              className="text-xs leading-none"
              style={{ color: "#3D5C41", letterSpacing: "0.1em" }}
            >
              DETECT SYSTEM
            </div>
          </div>
        </div>

        {/* System status bar */}
        <div
          className="mt-4 p-3 rounded-xl flex items-center gap-2"
          style={{
            background: "rgba(15,20,18,0.6)",
            border: "1px solid rgba(129,199,132,0.1)",
          }}
        >
          <div className="w-2 h-2 rounded-full status-online flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold" style={{ color: "#81C784" }}>
              SYSTEM ONLINE
            </div>
            <div className="text-xs" style={{ color: "#4A5C4E" }}>
              16 sensors active
            </div>
          </div>
          <Wifi className="w-3 h-3 ml-auto" style={{ color: "#3D5C41" }} />
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-6 h-px"
        style={{ background: "rgba(129,199,132,0.1)" }}
      />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p
          className="px-3 py-2 text-xs font-bold tracking-widest"
          style={{ color: "#3D5C41" }}
        >
          NAVIGATION
        </p>
        {(() => {
          const pathname = usePathname();
          return NAV_ITEMS.map(({ href, icon: Icon, label, desc }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive ? "nav-active" : "hover:bg-white/5"}`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                  ${isActive ? "bg-green-900/60" : "bg-white/5 group-hover:bg-white/10"}`}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? "#81C784" : "#5F6B63" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-semibold ${isActive ? "" : ""}`}
                    style={{ color: isActive ? "#81C784" : "#E8F5E9" }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: "#4A5C4E" }}
                  >
                    {desc}
                  </div>
                </div>
                {isActive && (
                  <ChevronRight
                    className="w-3 h-3 flex-shrink-0"
                    style={{ color: "#81C784" }}
                  />
                )}
              </Link>
            );
          });
        })()}
      </nav>

      {/* Bottom: user + logout */}
      <div className="p-4 pt-0">
        <div
          className="mx-0 h-px mb-4"
          style={{ background: "rgba(129,199,132,0.1)" }}
        />
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #2E7D32, #388E3C)",
              color: "#E8F5E9",
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-semibold truncate"
              style={{ color: "#E8F5E9" }}
            >
              {user?.name || "User"}
            </div>
            <div className="text-xs capitalize" style={{ color: "#4A5C4E" }}>
              {user?.role?.toLowerCase() || "user"}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-red-500/10 group"
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-red-500/20 transition-all">
            <LogOut className="w-4 h-4" style={{ color: "#EF5350" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "#EF5350" }}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
