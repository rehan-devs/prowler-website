"use client";

import Link from "next/link";
import { Home, CreditCard, Download, HelpCircle, Zap } from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { usePathname } from "next/navigation";

const navItems = [
  { title: 'Home', icon: Home, href: '/' },
  { title: 'Pricing', icon: CreditCard, href: '/pricing' },
  { title: 'Download', icon: Download, href: '/download' },
  { title: 'Support', icon: HelpCircle, href: '/support' },
  { title: 'Get Prowler', icon: Zap, href: '/pricing', isPrimary: true },
];

export function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, title: string) => {
    // If the user clicks 'Home' and is already on the home page, smoothly scroll to top
    if (title === 'Home' && pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className='fixed bottom-6 left-1/2 z-50 max-w-full -translate-x-1/2'>
      <Dock className='items-end pb-3'>
        {navItems.map((item, idx) => (
          <Link 
            href={item.href} 
            key={idx}
            onClick={(e) => handleItemClick(e, item.href, item.title)} // ← Intercepts clicking Home
          >
            <DockItem className={`aspect-square rounded-full transition-colors ${
              item.isPrimary ? 'bg-accent text-white' : 'bg-background hover:bg-foreground/5 text-foreground'
            }`}>
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>
                <item.icon className="h-full w-full" strokeWidth={2.5} />
              </DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );
}