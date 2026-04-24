import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="aurora-wrap">
      <Navbar />
      <main id="main">{children}</main>
    </div>
  );
}

export default MainLayout;
