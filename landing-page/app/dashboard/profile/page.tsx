"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  LogOut,
  Edit2,
  Check,
  X,
  Bell,
  Wifi,
  Activity,
  MapPin,
  Droplets,
  TreePine,
  Calendar,
  AlertCircle,
  Leaf,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useFarmInfo } from "@/hooks/use-farmer-info";
import { FarmFormErrors, FarmFormState, FormFieldMetadata } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

function FarmInfoSection() {
  const toast = useToast();
  const { farmInfo, updateFarm } = useFarmInfo();
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [form, setForm] = useState<FarmFormState | null>(null);
  const [errors, setErrors] = useState<FarmFormErrors>({});

  const today = new Date().toISOString().split("T")[0];
  const startEdit = (): void => {
    setForm({
      farmername: farmInfo?.farmername || "",
      water_canal_present: farmInfo?.water_canal_present ?? "",
      forest_distance_m: farmInfo?.forest_distance_m ?? "",
      harvest_date: farmInfo?.harvest_date || "",
    });
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = (): void => {
    setEditing(false);
    setForm(null);
    setErrors({});
  };

  const validate = (currentForm: FarmFormState): FarmFormErrors => {
    const errs: FarmFormErrors = {};
    if (!currentForm.farmername?.trim()) {
      errs.farmername = "Required";
    }

    if (
      currentForm.water_canal_present === "" ||
      currentForm.water_canal_present === null
    ) {
      errs.water_canal_present = "Required";
    } else if (Number(currentForm.water_canal_present) < 0) {
      errs.water_canal_present = "Must be positive";
    }

    if (
      currentForm.forest_distance_m === "" ||
      currentForm.forest_distance_m === null
    ) {
      errs.forest_distance_m = "Required";
    } else if (Number(currentForm.forest_distance_m) < 0) {
      errs.forest_distance_m = "Must be positive";
    }

    if (!currentForm.harvest_date) {
      errs.harvest_date = "Required";
    } else if (currentForm.harvest_date < today) {
      errs.harvest_date = "Cannot be in the past";
    }

    return errs;
  };

  const handleSave = async (): Promise<void> => {
    if (!form) return; // Guard clause against uninitialized states

    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      await updateFarm({
        farmername: form.farmername.trim(),
        water_canal_present: Number(form.water_canal_present),
        forest_distance_m: Number(form.forest_distance_m),
        harvest_date: form.harvest_date,
      });
      setEditing(false);
      setForm(null);
      alert("Farm information updated!");
      // toast.success('Farm information updated!');
    } catch (error) {
      alert("Failed to update. Please try again");
      // toast.error('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Explicit type bounds for curried change tracking captures
  const set =
    (field: keyof FarmFormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const val = e.target.value;
      setForm((f) => (f ? { ...f, [field]: val } : null));
      if (errors[field]) {
        setErrors((er) => ({ ...er, [field]: "" }));
      }
    };

  const inputStyle = (hasErr: boolean | undefined): React.CSSProperties => ({
    background: "rgba(15,20,18,0.8)",
    border: hasErr
      ? "1.5px solid rgba(239,83,80,0.7)"
      : "1.5px solid rgba(129,199,132,0.25)",
    color: "#E8F5E9",
    borderRadius: "10px",
    padding: "9px 14px",
    width: "100%",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  // Fields blueprint mapped explicitly via our metadata blueprint contract
  const FIELDS: FormFieldMetadata[] = [
    {
      key: "farmername",
      label: "Farmer Name",
      icon: User,
      type: "text",
      placeholder: "e.g. Kamal Perera",
    },
    {
      key: "water_canal_present",
      label: "Water Canal Distance",
      icon: Droplets,
      type: "number",
      unit: "m",
      placeholder: "Distance in meters",
    },
    {
      key: "forest_distance_m",
      label: "Forest Distance",
      icon: TreePine,
      type: "number",
      unit: "m",
      placeholder: "Distance in meters",
    },
    {
      key: "harvest_date",
      label: "Expected Harvest Date",
      icon: Calendar,
      type: "date",
      min: today,
    },
  ];

  // Render context presentation blocks...
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "rgba(27,35,30,0.7)",
        border: "1px solid rgba(129,199,132,0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(129,199,132,0.1)",
              border: "1px solid rgba(129,199,132,0.2)",
            }}
          >
            <Leaf className="w-4 h-4" style={{ color: "#81C784" }} />
          </div>
          <div>
            <h3
              className="font-display font-bold text-sm"
              style={{ color: "#E8F5E9" }}
            >
              Farm Information
            </h3>
            <p className="text-xs" style={{ color: "#4A5C4E" }}>
              Your agricultural setup details
            </p>
          </div>
        </div>
        {!editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
            style={{
              background: "rgba(129,199,132,0.1)",
              border: "1px solid rgba(129,199,132,0.2)",
              color: "#81C784",
            }}
          >
            <Edit2 className="w-3 h-3" /> Edit
          </button>
        )}
      </div>

      {!farmInfo && !editing ? (
        <div className="py-6 text-center">
          <div className="text-3xl mb-2 opacity-40">🌱</div>
          <p className="text-sm" style={{ color: "#3D5C41" }}>
            No farm information saved yet
          </p>
          <button
            onClick={startEdit}
            className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
            style={{
              background: "rgba(129,199,132,0.15)",
              border: "1px solid rgba(129,199,132,0.25)",
              color: "#81C784",
            }}
          >
            Add Farm Info
          </button>
        </div>
      ) : editing && form ? (
        <div className="space-y-3">
          {FIELDS.map(
            ({ key, label, icon: Icon, type, unit, placeholder, min }) => (
              <div key={key}>
                <label
                  className="flex items-center gap-1.5 text-xs font-semibold mb-1"
                  style={{ color: "#5F6B63" }}
                >
                  <Icon className="w-3 h-3" style={{ color: "#3D5C41" }} />{" "}
                  {label}
                  {errors[key] && (
                    <span
                      className="ml-auto flex items-center gap-0.5"
                      style={{ color: "#EF5350" }}
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors[key]}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={type}
                    value={form[key]}
                    onChange={set(key)}
                    placeholder={placeholder}
                    min={min}
                    style={inputStyle(!!errors[key])}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(129,199,132,0.7)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(129,199,132,0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors[key]
                        ? "rgba(239,83,80,0.7)"
                        : "rgba(129,199,132,0.25)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {unit && (
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none"
                      style={{ color: "#3D5C41" }}
                    >
                      {unit}
                    </span>
                  )}
                </div>
              </div>
            ),
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: saving
                  ? "rgba(46,125,50,0.4)"
                  : "linear-gradient(135deg, #2E7D32, #388E3C)",
                color: "#E8F5E9",
                boxShadow: saving ? "none" : "0 4px 12px rgba(46,125,50,0.35)",
              }}
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
              style={{
                background: "rgba(27,35,30,0.8)",
                border: "1px solid rgba(129,199,132,0.15)",
                color: "#5F6B63",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {[
            { icon: User, label: "Farmer Name", value: farmInfo?.farmername },
            {
              icon: Droplets,
              label: "Water Canal Distance",
              value:
                farmInfo?.water_canal_present != null
                  ? `${farmInfo.water_canal_present} m`
                  : "—",
            },
            {
              icon: TreePine,
              label: "Forest Distance",
              value:
                farmInfo?.forest_distance_m != null
                  ? `${farmInfo.forest_distance_m} m`
                  : "—",
            },
            {
              icon: Calendar,
              label: "Harvest Date",
              value: farmInfo?.harvest_date
                ? new Date(farmInfo.harvest_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between p-2.5 rounded-xl"
              style={{ background: "rgba(15,20,18,0.4)" }}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: "#3D5C41" }}
                />
                <span className="text-xs" style={{ color: "#5F6B63" }}>
                  {label}
                </span>
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: "#A5D6A7" }}
              >
                {value || "—"}
              </span>
            </div>
          ))}
          <div className="pt-1">
            <button
              // onClick={resetFarmInfo}
              className="text-xs transition-colors hover:opacity-80"
              style={{ color: "#3D5C41" }}
            >
              Reset & re-enter farm info
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "Farm Manager");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const stats = [
    { label: "Fields Monitored", value: "1", icon: MapPin, color: "#81C784" },
    { label: "Active Sensors", value: "16", icon: Wifi, color: "#A5D6A7" },
    { label: "Alerts Today", value: "3", icon: Bell, color: "#FF8F00" },
    { label: "Uptime", value: "99.8%", icon: Activity, color: "#81C784" },
  ];

  const activity = [
    { action: "Logged in", time: "Today, 09:15", icon: "🔐" },
    { action: "S1 HIGH alert acknowledged", time: "Today, 08:45", icon: "⚠️" },
    { action: "AI prediction run", time: "Yesterday, 17:30", icon: "🧠" },
    { action: "S15 MEDIUM alert", time: "Yesterday, 20:10", icon: "📡" },
  ];

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2
          className="font-display text-2xl font-bold"
          style={{ color: "#E8F5E9" }}
        >
          My Profile
        </h2>
        <p className="text-sm mt-1" style={{ color: "#5F6B63" }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Profile card */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: "rgba(27,35,30,0.7)",
          border: "1px solid rgba(129,199,132,0.15)",
        }}
      >
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-display font-bold"
              style={{
                background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
                border: "3px solid rgba(129,199,132,0.3)",
                color: "#E8F5E9",
                boxShadow: "0 0 20px rgba(129,199,132,0.2)",
              }}
            >
              {name[0]?.toUpperCase() || "U"}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 status-online"
              style={{ borderColor: "#0F1412", background: "#81C784" }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-sm font-bold"
                      style={{
                        background: "rgba(15,20,18,0.8)",
                        border: "1px solid rgba(129,199,132,0.3)",
                        color: "#E8F5E9",
                        width: "180px",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={() => setEditing(false)}
                      className="p-1.5 rounded-lg"
                      style={{
                        background: "rgba(129,199,132,0.2)",
                        color: "#81C784",
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setName(user?.name || "Farm Manager");
                        setEditing(false);
                      }}
                      className="p-1.5 rounded-lg"
                      style={{
                        background: "rgba(239,83,80,0.15)",
                        color: "#EF5350",
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-display text-xl font-bold"
                      style={{ color: "#E8F5E9" }}
                    >
                      {name}
                    </h3>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-1 rounded"
                      style={{ color: "#3D5C41" }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-3 h-3" style={{ color: "#81C784" }} />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#81C784" }}
                  >
                    {user?.role || "USER"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <div
                className="px-3 py-1 rounded-lg text-xs"
                style={{ background: "rgba(15,20,18,0.6)", color: "#5F6B63" }}
              >
                ID: #{user?.id || "1"}
              </div>
              <div
                className="px-3 py-1 rounded-lg text-xs"
                style={{ background: "rgba(15,20,18,0.6)", color: "#5F6B63" }}
              >
                EleGuard LK Member
              </div>
              <div
                className="px-3 py-1 rounded-lg text-xs flex items-center gap-1"
                style={{
                  background: "rgba(129,199,132,0.1)",
                  color: "#81C784",
                  border: "1px solid rgba(129,199,132,0.2)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-4 rounded-2xl text-center"
            style={{
              background: "rgba(27,35,30,0.7)",
              border: "1px solid rgba(129,199,132,0.1)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{
                background: "rgba(15,20,18,0.6)",
                border: "1px solid rgba(129,199,132,0.1)",
              }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="font-display text-2xl font-bold" style={{ color }}>
              {value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#4A5C4E" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Farm Info Section */}
      <FarmInfoSection />

      {/* Recent activity */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: "rgba(27,35,30,0.7)",
          border: "1px solid rgba(129,199,132,0.1)",
        }}
      >
        <h3
          className="font-display font-bold mb-4"
          style={{ color: "#E8F5E9" }}
        >
          Recent Activity
        </h3>
        <div className="space-y-3">
          {activity.map(({ action, time, icon }) => (
            <div
              key={action}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(15,20,18,0.4)" }}
            >
              <span className="text-lg">{icon}</span>
              <div className="flex-1">
                <div className="text-sm" style={{ color: "#E8F5E9" }}>
                  {action}
                </div>
                <div className="text-xs" style={{ color: "#3D5C41" }}>
                  {time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: "rgba(27,35,30,0.7)",
          border: "1px solid rgba(239,83,80,0.15)",
        }}
      >
        <h3
          className="font-display font-bold mb-1"
          style={{ color: "#E8F5E9" }}
        >
          Account Actions
        </h3>
        <p className="text-xs mb-4" style={{ color: "#5F6B63" }}>
          You will be redirected to the login page
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:brightness-110"
          style={{
            background:
              "linear-gradient(135deg, rgba(198,40,40,0.8), rgba(183,28,28,0.9))",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(239,83,80,0.3)",
          }}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
