'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  const navLinks = [
    { href: '/', label: 'Submit Complaint' },
    { href: '/track', label: 'Track Complaint' },
    { href: '/admin/login', label: 'Admin Login' },
  ];

  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <Building2 className="h-6 w-6" />
            <span>Hall Helper</span>
          </Link>
          
          {!isAdminRoute && (
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Button key={link.href} asChild variant={pathname === link.href ? 'default' : 'ghost'}>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
