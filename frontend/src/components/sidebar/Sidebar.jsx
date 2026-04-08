import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const sidebarConfig = {
    ADMIN: [
      {
        title: "MAIN",
        items: [
          { name: "Dashboard", path: "/admin/dashboard" },
          { name: "Analytics", path: "/admin/analytics" },
          { name: "Reports", path: "/admin/reports" },
        ],
      },
      {
        title: "USERS",
        items: [
          { name: "Create User", path: "/admin/create-user" },
          { name: "Manage Users", path: "/admin/users", count: 24 },
          { name: "Roles & Permissions", path: "/admin/roles-permissions" },
        ],
      },
      {
        title: "SYSTEM",
        items: [
          { name: "Queue Settings", path: "/admin/queue-settings" },
          { name: "Notifications", path: "/admin/notifications", count: 3 },
        ],
      },
    ],
    TRIAGE: [
      {
        title: "MAIN",
        items: [
          { name: "Dashboard", path: "/triage/dashboard" },
          { name: "Register Patient", path: "/triage/register" },
          { name: "Queue", path: "/triage/queue" },
        ],
      },
    ],
    DOCTOR: [
      {
        title: "MAIN",
        items: [
          { name: "Dashboard", path: "/doctor/dashboard" },
          { name: "My Queue", path: "/doctor/queue" },
        ],
      },
    ],
  };

  const menuSections = sidebarConfig[user?.role] || [];

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white text-zinc-900 border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="relative shrink-0">
            <div className="grid w-12 h-12 place-items-center rounded-full border border-gray-300 bg-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </div>
          </div>
          <div className="min-w-0">
            {user ? (
              <>
                <p className="text-gray-800 font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-gray-400 text-xs mt-0.5 tracking-wide truncate">{user?.role}</p>
              </>
            ) : (
              <>
                <p className="text-gray-800 font-semibold text-sm truncate">Guest</p>
                <p className="text-gray-400 text-xs mt-0.5 tracking-wide truncate">Please sign in to continue</p>
              </>
            )}
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="px-4 py-4 space-y-4">
          {user ? (
            menuSections.map((section) => (
              <div key={section.title}>
                <div className="mb-2 flex items-center gap-2 px-1">
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-gray-400">
                    {section.title}
                  </p>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1.5 transition-colors 
                    ${
                      location.pathname === item.path
                        ? "bg-zinc-800 text-white"
                        : "text-gray-600 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    <span className="flex-1">{item.name}</span>
                    {item.count ? (
                      <span className="text-[11px] leading-none px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">
                        {item.count}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            ))
          ) : (
            <button
              onClick={handleLogin}
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Login
            </button>
          )}
        </nav>

        {/* Logout */}
        {user ? (
          <div className="absolute bottom-6 left-0 right-0 px-4 pt-4 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Log Out
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};


export default Sidebar;