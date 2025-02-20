import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { fetchProfile } from '@/utils/api';

const Header = () => {
  const token = sessionStorage.getItem('token');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: userData } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetchProfile(token),
    enabled: !!token,
    retry: false,
    staleTime: 0,
  });

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');

    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    queryClient.removeQueries({ queryKey: ['userProfile'] });
    navigate('/login');
  };

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

          {userData && (
            <>
              <Link to="/qcms" className="text-foreground hover:text-primary transition">
                QCM
              </Link>

              <Link to="/profile" className="text-foreground hover:text-primary transition">
                Profil
              </Link>

              {userData.isAdmin && (
                <Link to="/dashboard" className="text-foreground hover:text-primary transition">
                  Dashboard
                </Link>
              )}
            </>
          )}

          <Link to="/contact" className="text-foreground hover:text-primary transition">
            Contact
          </Link>
        </nav>

        {userData ? (
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="outline">Connexion</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
