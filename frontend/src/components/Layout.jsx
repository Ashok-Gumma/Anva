import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-base-200 flex flex-col">
      <Navbar />

      {/* pb-20 for bottom nav on mobile; md:pb-0 hides it on desktop */}
      <main className="flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
};
export default Layout;

