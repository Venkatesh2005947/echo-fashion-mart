
import React, { useState } from 'react';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import LoginModal from './LoginModal';
import CartModal from './CartModal';

const Header: React.FC = () => {
  const { user, cart, logout } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold fashion-text-gradient">
              EchoFashion
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#mens" className="text-muted-foreground hover:text-foreground transition-colors">
                Men's
              </a>
              <a href="#womens" className="text-muted-foreground hover:text-foreground transition-colors">
                Women's
              </a>
              <a href="#accessories" className="text-muted-foreground hover:text-foreground transition-colors">
                Accessories
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCartModal(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Hello, {user.name}
                </span>
                {user.isAdmin && (
                  <Badge variant="secondary">Admin</Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLoginModal(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <LoginModal 
        open={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      <CartModal 
        open={showCartModal} 
        onClose={() => setShowCartModal(false)} 
      />
    </>
  );
};

export default Header;
