import { Shield } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-primary-foreground leading-tight">
                MISAFA
              </span>
              <span className="text-xs text-primary-foreground/60 -mt-1">
                Technologies
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-primary-foreground/70 text-sm text-center">
            Powering, Protecting & Automating the Future
          </p>

          {/* Copyright */}
          <p className="text-primary-foreground/50 text-sm">
            © {currentYear} Misafa Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
