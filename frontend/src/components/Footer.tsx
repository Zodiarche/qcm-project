const Footer = () => {
  return (
    <footer id="footer" className="bg-background border-t shadow-md">
      <div className="container mx-auto flex items-center justify-center px-6 py-4">
        <p className="text-sm">
          © {new Date().getFullYear()} -{' '}
          <a href="https://github.com/Zodiarche" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition">
            Benjamin GUILLEMIN
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
