import { useAuth } from "@/hooks/use-auth";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  // If not authenticated, only render the children (which will be the login page)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow overflow-hidden">
        <div className="container mx-auto h-full flex">
          <Sidebar />
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
