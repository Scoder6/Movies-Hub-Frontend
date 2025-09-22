import { Link, useLocation } from 'react-router-dom';
import { Film, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 hover:scale-105">
            <div className="relative">
              <Film className="h-8 w-8 text-primary transition-transform duration-300 hover:rotate-12" />
              <div className="absolute -inset-1 bg-gradient-primary rounded-full opacity-20 blur-sm transition-all duration-500 hover:opacity-30 hover:blur-md"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:bg-gradient-secondary transition-all duration-300">
              MovieHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 px-2 py-1 rounded-md hover:bg-primary/5 ${isActive('/') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
            >
              Movies
            </Link>
            <Link
              to="/suggest"
              className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 px-2 py-1 rounded-md hover:bg-primary/5 ${isActive('/suggest') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
            >
              suggest
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 px-2 py-1 rounded-md hover:bg-primary/5 ${isActive('/admin') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full transition-all duration-300 hover:bg-primary/10 hover:scale-110">
                  <Avatar className="h-8 w-8 transition-transform duration-300 hover:scale-110">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground transition-all duration-300 hover:bg-gradient-secondary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 transition-all duration-200" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="transition-colors duration-200">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="transition-colors duration-200">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="transition-colors duration-200 hover:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:bg-primary/10 hover:scale-105">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="transition-all duration-300 hover:scale-105">
                <Link to="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}