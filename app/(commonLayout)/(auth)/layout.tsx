import Footer from "@/components/shared/publicFooter";
import Navbar from "@/components/shared/publicNavbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default CommonLayout;
