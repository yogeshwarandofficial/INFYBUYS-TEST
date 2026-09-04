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

const navLinkClasses = "relative text-[17px] font-bold text-white/80 bg-transparent hover:bg-transparent hover:text-[#ffffff] data-[state=open]:!bg-transparent data-[state=open]:text-[#ffffff] px-4 focus:!bg-transparent focus:text-[#ffffff] after:absolute after:bottom-[8px] after:left-4 after:right-4 after:h-[2px] after:origin-center after:scale-x-0 hover:after:scale-x-100 data-[state=open]:after:scale-x-100 focus:after:scale-x-100 after:transition-transform after:duration-300 after:bg-[#ffffff] [.is-scrolled_&]:text-[#0B152A] [.is-scrolled_&]:hover:text-[#0B4C8C] [.is-scrolled_&]:data-[state=open]:text-[#0B4C8C] [.is-scrolled_&]:focus:text-[#0B4C8C] [.is-scrolled_&]:after:bg-[#0B4C8C] transition-colors";

export function DesktopNav() {
  return (
    <NavigationMenu className="[&_[data-slot=navigation-menu-viewport]]:!bg-white/95 [&_[data-slot=navigation-menu-viewport]]:backdrop-blur-[20px] [&_[data-slot=navigation-menu-viewport]]:border [&_[data-slot=navigation-menu-viewport]]:border-[#155B9E]/10 [&_[data-slot=navigation-menu-viewport]]:shadow-[0_10px_40px_-10px_rgba(11,27,53,0.12)] [&_[data-slot=navigation-menu-viewport]]:!rounded-2xl">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), navLinkClasses)}>
            Browse Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
            'group block select-none rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-[#EAF3FB]/80 focus:bg-[#EAF3FB]/80',
            className
          )}
          {...props}
        >
          <div className="text-[15px] font-semibold leading-none text-[#0B1B35] group-hover:text-[#155B9E] transition-colors duration-300 mb-2">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-[#526784] group-hover:text-[#0B1B35] transition-colors duration-300">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
