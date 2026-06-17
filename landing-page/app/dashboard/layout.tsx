"use client";

import React, { useState } from "react";
import Sidebar from "@/components/eleguard/sidebar";
// import { Header } from "@/components/dashboard/header";
import { Activity, Bell, Clock, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Toast, ToastProvider } from "@/components/ui/toast";
import { FarmInfoProvider } from "@/hooks/use-farmer-info";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0F1412" }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0"
        style={{
          background: "rgba(27,35,30,0.95)",
          borderRight: "1px solid rgba(129,199,132,0.1)",
        }}
      >
        <Sidebar />
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 flex flex-col"
            style={{
              background: "rgba(15,20,18,0.98)",
              border: "1px solid rgba(129,199,132,0.15)",
            }}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-lg"
              style={{ color: "#5F6B63" }}
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center gap-4 px-6 py-4 topbar-gradient shrink-0"
          style={{
            borderBottom: "1px solid rgba(129,199,132,0.08)",
            minHeight: "72px",
          }}
        >
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-xl"
            style={{ color: "#81C784", background: "rgba(129,199,132,0.1)" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* System indicator */}
          <div className="hidden lg:flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: "#81C784" }} />
            <span
              className="font-display font-semibold text-sm tracking-wider"
              style={{ color: "#81C784" }}
            >
              ELEPHANT DETECT SYSTEM
            </span>
          </div>

          <div className="flex-1" />

          {/* Notifications */}
          <button
            className="relative p-2.5 rounded-xl transition-all hover:bg-white/5"
            style={{
              background: "rgba(129,199,132,0.08)",
              border: "1px solid rgba(129,199,132,0.15)",
            }}
          >
            <Bell className="w-4 h-4" style={{ color: "#81C784" }} />
            {notifications > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                style={{
                  background: "#EF5350",
                  color: "#fff",
                  fontSize: "9px",
                }}
              >
                {notifications}
              </span>
            )}
          </button>

          {/* Online status */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(15,20,18,0.6)",
              border: "1px solid rgba(129,199,132,0.1)",
            }}
          >
            <div className="w-2 h-2 rounded-full status-online" />
            <span
              className="text-xs font-semibold hidden sm:block"
              style={{ color: "#A5D6A7" }}
            >
              {user?.name || "Online"}
            </span>
          </div>

          {/* Clock */}
          <Clock />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ToastProvider>
            <FarmInfoProvider>
              <div className="page-enter">{children}</div>
            </FarmInfoProvider>
          </ToastProvider>
        </main>
      </div>
    </div>
  );
}
