import { Link } from 'react-router';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CATEGORIES } from '@/components/seller/listings/SellerListingForm';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left text-2xl font-black text-primary">InfyBuys.</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-8">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Categories</h4>
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/search?category=${encodeURIComponent(category)}`}
                onClick={() => onOpenChange(false)}
                className="text-lg font-medium hover:text-primary transition-colors py-1"
              >
                {category}
              </Link>
            ))}
          </div>

          <div className="w-full h-px bg-border my-2" />

          <div className="flex flex-col gap-4">
            <Link to="/pricing" onClick={() => onOpenChange(false)} className="text-lg font-medium">Pricing</Link>
            <Link to="/about" onClick={() => onOpenChange(false)} className="text-lg font-medium">About Us</Link>
            <Link to="/contact" onClick={() => onOpenChange(false)} className="text-lg font-medium">Contact</Link>
          </div>

          <div className="w-full h-px bg-border my-2" />

          <div className="flex flex-col gap-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/login" onClick={() => onOpenChange(false)}>Log in</Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link to="/register" onClick={() => onOpenChange(false)}>Sign up</Link>
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-medium">Theme</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
