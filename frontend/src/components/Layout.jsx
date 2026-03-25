import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />

          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
          
          <BottomNav />
        </div>
      </div>
    </div>
  );
};
export default Layout;
