import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-base-200 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar — only shown when showSidebar=true, always hidden on mobile */}
        {showSidebar && <Sidebar />}

        {/* Main Content Area */}
        {/* pb-[calc(5rem+env(safe-area-inset-bottom,0px))] reserves space for the mobile BottomNav */}
        <main className="flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0 min-w-0">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
export default Layout;

