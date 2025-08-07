import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

export default function Layout({ children }) {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isAuthPage = location === '/login' || location === '/register';
  const isHomePage = location === '/';

  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // Show sidebar for authenticated users (except home page)
  const showSidebar = isAuthenticated && user && !isHomePage;

  return (
    <div className="min-h-screen bg-background flex">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 flex flex-col ${showSidebar ? "ml-80" : ""}`}>
        {!showSidebar && <Header />}
        <main className={`flex-1 ${!showSidebar ? 'pt-16' : 'p-6'}`}>
          {children}
        </main>
        {!showSidebar && <Footer />}
      </div>
    </div>
  );
}
