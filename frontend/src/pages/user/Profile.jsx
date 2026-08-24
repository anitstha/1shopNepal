import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Mail, Package, Phone, ShieldCheck, User } from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  useDocumentTitle("My Profile");
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();

  // Editable fields (email is read-only)
  const [form, setForm] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <EmptyState
          icon={User}
          title="You are not logged in"
          description="Log in to view and manage your profile."
        >
          <Link
            to="/login"
            state={{ from: "/profile" }}
            className="inline-block rounded-lg bg-neutral-950 px-6 py-3 text-sm font-bold text-white"
          >
            Go to Login
          </Link>
        </EmptyState>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  /** Saves the profile edits via AuthContext. */
  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
  };

  /** Logs out and returns to the home page. */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const inputClasses =
    "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50";

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Heading + avatar */}
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950 text-xl font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{user.name}</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-emerald-700">
            <ShieldCheck className="h-3 w-3" /> {user.role}
          </span>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          to="/my-orders"
          className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <Package className="h-5 w-5 text-neutral-400" />
          <span className="text-sm font-medium">My Orders</span>
        </Link>
        {user.role === "admin" && (
          <Link
            to="/admin"
            className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-bold">Admin Panel</span>
          </Link>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-left transition-colors hover:bg-red-100"
        >
          <LogOut className="h-5 w-5 text-red-600" />
          <span className="text-sm font-bold text-red-600">Log out</span>
        </button>
      </div>

      {/* Editable details */}
      <form onSubmit={handleSave} className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-neutral-950">Account Details</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Email address <span className="text-xs text-neutral-400">(cannot be changed)</span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className={`${inputClasses} pl-11`}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            className="rounded-xl bg-neutral-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Save Changes
          </button>
          {saved && (
            <p className="text-sm font-semibold text-emerald-600">Profile updated!</p>
          )}
        </div>
      </form>

      {/* Contact info summary */}
      <p className="mt-6 flex items-center gap-2 text-sm text-neutral-500">
        <Phone className="h-4 w-4" /> Need help? Call us at +977 98XXXXXXXX
      </p>
    </section>
  );
};

export default Profile;
