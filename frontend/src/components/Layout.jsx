import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
      
      <BottomNav />
    </div>
  );
};
export default Layout;
