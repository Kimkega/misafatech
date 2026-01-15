import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Shield, Zap, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  logo_url: string | null;
  site_name: string;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("logo_url, site_name")
      .limit(1)
      .single();
    if (data) setSettings(data);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "#products" },
    { name: "Deals", href: "#deals" },
    { name: "Energy Calculator", href: "#calculator", icon: Zap },
    { name: "Contact", href: "#contact" },
    { name: "Track Order", href: "/my-orders", icon: Package, isLink: true },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-card/95 backdrop-blur-lg shadow-lg border-b border-border' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 relative z-50">
            {settings?.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.site_name} 
                className="h-10 md:h-12 w-auto object-contain"
              />
            ) : (
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg ${
                scrolled ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <Shield className={`w-6 h-6 md:w-7 md:h-7 ${scrolled ? 'text-white' : 'text-white'}`} />
              </div>
            )}
            <div className="flex flex-col">
              <span className={`font-display font-bold text-lg md:text-xl leading-tight ${scrolled ? 'text-foreground' : 'text-white'}`}>
                {settings?.site_name?.split(' ')[0] || 'MISAFA'}
              </span>
              <span className={`text-xs -mt-1 ${scrolled ? 'text-muted-foreground' : 'text-white/70'}`}>
                Technologies
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.isLink ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                    scrolled 
                      ? 'text-muted-foreground hover:text-foreground hover:bg-muted' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4 text-emerald-400" />}
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                    scrolled 
                      ? 'text-muted-foreground hover:text-foreground hover:bg-muted' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4 text-yellow-400" />}
                  {link.name}
                </a>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 relative z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in bg-card rounded-b-2xl shadow-xl">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                link.isLink ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2 px-4 py-3 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && <link.icon className="w-4 h-4 text-emerald-500" />}
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2 px-4 py-3 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && <link.icon className="w-4 h-4 text-yellow-500" />}
                    {link.name}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
