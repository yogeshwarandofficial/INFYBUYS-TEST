import { Link } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { CATEGORIES } from '@/constants/marketing';
import { cn } from '@/lib/utils';
import React from 'react';

const navLinkClasses = "relative text-[17px] font-bold text-slate-800 bg-transparent hover:bg-transparent hover:text-brand-blue data-[state=open]:!bg-transparent data-[state=open]:text-brand-blue px-4 focus:!bg-transparent focus:text-brand-blue after:absolute after:bottom-[8px] after:left-4 after:right-4 after:h-[2px] after:origin-center after:scale-x-0 hover:after:scale-x-100 data-[state=open]:after:scale-x-100 focus:after:scale-x-100 after:transition-transform after:duration-300 after:bg-brand-blue";

export function DesktopNav() {
  return (
    <NavigationMenu className="[&_[data-slot=navigation-menu-viewport]]:!bg-white">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), navLinkClasses)}>
            Browse Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {CATEGORIES.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  to={`/search?category=${category.name}`}
                >
                  Explore {category.name} businesses
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), navLinkClasses)}>
            <Link to="/pricing">Pricing</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), navLinkClasses)}>
            <Link to="/about">About Us</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), navLinkClasses)}>
            <Link to="/contact">Contact</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string; to: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={to}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-slate-900">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-600">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
