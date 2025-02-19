import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer id="footer" className="bg-background border-t shadow-md">
      <div className="container mx-auto flex items-center justify-center px-6 py-4">
        <p className="text-sm">
          © {new Date().getFullYear()} -{' '}
          <Link to="https://github.com/Zodiarche" className="text-foreground hover:text-primary transition">
            Benjamin GUILLEMIN
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
