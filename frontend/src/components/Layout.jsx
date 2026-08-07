import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-base-200 flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
};
export default Layout;

