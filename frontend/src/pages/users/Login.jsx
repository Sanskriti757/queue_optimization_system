import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setApiError("");
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
     const res= await login({ email, password });
     const role = res.user.role;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "DOCTOR") navigate("/doctor/dashboard");
      else if (role === "TRIAGE") navigate("/triage/dashboard");
      else {
        setApiError("Unauthorized role. Contact support.");
        await logout();
      }

    } catch (error) {
      setApiError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">

      <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-10 sm:px-6">
        <div className="mb-7 text-center">

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">MediQ Admin</h1>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to access the admin dashboard</p>
        </div>

        <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.45)] sm:p-7">
          {apiError && (
            <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Admin Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <EmailIcon />
                </span>
                <input
                  type="email"
                  placeholder="admin@mediqueue.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  className={`w-full rounded-lg border bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400
                    ${errors.email ? "border-rose-400 focus:ring-2 focus:ring-rose-100" : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <LockIcon />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: "" }));
                  }}
                  className={`w-full rounded-lg border bg-slate-50 py-2.5 pl-9 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400
                    ${errors.password ? "border-rose-400 focus:ring-2 focus:ring-rose-100" : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-4 h-px bg-slate-200" />
          <p className="text-center text-xs text-slate-500">Need help? <span className="font-semibold text-slate-700">Contact IT Support</span></p>
        </section>

        <p className="mt-6 text-xs text-slate-500">Authorized personnel only</p>
      </main>
    </div>
  );
}