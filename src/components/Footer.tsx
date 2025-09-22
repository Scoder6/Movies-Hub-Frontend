import { Film, Github, Twitter, Mail, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-primary transition-transform duration-300 hover:rotate-12" />
              <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                MovieHub
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover, rate, and discuss your favorite movies with fellow film enthusiasts.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Browse Movies
                </Link>
              </li>
              <li><span className="cursor-not-allowed opacity-50">Add Movies</span></li>
              <li><span className="cursor-not-allowed opacity-50">Watchlists</span></li>
              <li><span className="cursor-not-allowed opacity-50">Reviews</span></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-not-allowed opacity-50">Forums</span></li>
              <li><span className="cursor-not-allowed opacity-50">Movie Clubs</span></li>
              <li><span className="cursor-not-allowed opacity-50">Top Contributors</span></li>
              <li><span className="cursor-not-allowed opacity-50">Guidelines</span></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/saptash-chaubey-711a3322a/" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-primary/10">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com/Scoder6" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-primary/10">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:matulchaubey669@gmail.com" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-primary/10">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 MovieHub. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <span className="cursor-not-allowed opacity-50 transition-colors duration-300 hover:opacity-70">Privacy Policy</span>
            <span className="cursor-not-allowed opacity-50 transition-colors duration-300 hover:opacity-70">Terms of Service</span>
            <span className="cursor-not-allowed opacity-50 transition-colors duration-300 hover:opacity-70">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}