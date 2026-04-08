import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 w-full bg-white border-b border-gray-200 px-6 flex items-center justify-between h-14 shadow-sm">
        {/* Left: Logo + Brand */}
        <div className="flex items-center">
          <span className="text-gray-900 font-semibold text-base tracking-tight">Medi</span>
          <span className="text-slate-900 font-bold text-2xl tracking-tight">Q</span>
        </div>

        <div className="flex items-center">
          {user && onMenuClick && (
            <button
              onClick={onMenuClick}
              className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-blue-400 transition-all focus:outline-none focus:ring-blue-500 flex items-center justify-center"
              aria-label="Open profile sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;