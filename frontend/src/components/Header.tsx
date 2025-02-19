import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-background border-b shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-primary text-2xl font-bold">
          QCMSite
        </Link>

        <nav className="flex space-x-6">
          <Link to="/" className="text-foreground hover:text-primary transition">
            Accueil
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary transition">
            Contact
          </Link>
        </nav>

        <Link to="/login">
          <Button variant="outline">Connexion</Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
