import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, Heart } from "lucide-react";
import { useState } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/doctors", label: "Doctors" },
    { href: "/departments", label: "Departments" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body bg-slate-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Emergency: +1 (555) 123-4567
            </span>
            <span className="opacity-80">Mon - Sun: 24 Hours Open</span>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/login" className="hover:text-white/80 transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-slate-900 leading-none">MediCare</h1>
                <span className="text-xs text-muted-foreground font-medium tracking-wider">HEALTH CENTER</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative group py-2",
                    location === item.href ? "text-primary" : "text-slate-600"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300",
                    location === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
              <Link href="/contact">
                <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                  Book Appointment
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-lg animate-in slide-in-from-top-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-base font-medium text-slate-700 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              <Button className="w-full mt-4">Book Appointment</Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Heart className="h-6 w-6 fill-primary text-primary" />
              <span className="text-xl font-bold font-display">MediCare</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Providing world-class healthcare with compassion and excellence. Your health is our priority.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/doctors" className="hover:text-primary transition-colors">Our Doctors</Link></li>
              <li><Link href="/departments" className="hover:text-primary transition-colors">Departments</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Pediatrics</li>
              <li>Orthopedics</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>123 Healthcare Ave, Medical City</li>
              <li>contact@medicare.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs opacity-60">
          © 2024 MediCare Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
