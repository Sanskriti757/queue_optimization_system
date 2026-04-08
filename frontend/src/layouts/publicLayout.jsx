import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* No Navbar, No Login buttons - Pure public access */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;