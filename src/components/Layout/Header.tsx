import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, User, LogOut, Settings, Home, Users, Trophy, Newspaper } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      // Error handled in useAuth hook
    }
  };

  const navigationItems = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/teams', label: t('nav.teams'), icon: Users },
    { to: '/tournaments', label: t('nav.tournaments'), icon: Trophy },
    { to: '/news', label: t('nav.news'), icon: Newspaper },
  ];

  const adminItems = user ? [
    { to: '/admin', label: t('nav.admin'), icon: Settings },
    { to: '/subscription', label: t('nav.subscription'), icon: Settings },
  ] : [];

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="lg" className="md:hidden h-12 w-12">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b">
            <div className="font-bold text-xl text-primary">WAY Esports</div>
          </div>
          
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          
          {adminItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          
          <div className="pt-4 border-t">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>
                      {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{profile?.username || user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => navigate('/profile')}
                >
                  <Settings className="h-4 w-4" />
                  {t('nav.profile')}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => navigate('/auth')}
                >
                  {t('nav.login')}
                </Button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Navigation - moved to left */}
        {isMobile && <MobileNav />}
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="font-bold text-xl text-foreground">WAY Esports</div>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-6">
            {[...navigationItems, ...adminItems].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* User Menu / Auth */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>
                      {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">
                      {profile?.username || user.email}
                    </p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('nav.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/subscription')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('nav.subscription')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isMobile && (
              <Button onClick={() => navigate('/auth')}>
                {t('nav.login')}
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;