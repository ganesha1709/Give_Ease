import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'wouter';

export default function Layout({ children }) {
  const [location] = useLocation();
  const isAuthPage = location === '/login' || location === '/register';

  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
