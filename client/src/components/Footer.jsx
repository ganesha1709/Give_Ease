import { Heart, Facebook, Twitter, Instagram, Linkedin, Shield } from 'lucide-react';
import { Link } from 'wouter';

export default function Footer() {
  const platformLinks = [
    { href: '/#how-it-works', label: 'How it Works' },
    { href: '/browse', label: 'Browse Items' },
    { href: '/#ngo-partners', label: 'NGO Partners' },
    { href: '/#safety', label: 'Safety & Trust' },
    { href: '/#impact', label: 'Impact Stories' },
  ];

  const supportLinks = [
    { href: '/#help', label: 'Help Center' },
    { href: '/#contact', label: 'Contact Us' },
    { href: '/#privacy', label: 'Privacy Policy' },
    { href: '/#terms', label: 'Terms of Service' },
    { href: '/#guidelines', label: 'Community Guidelines' },
  ];

  const socialLinks = [
    { href: '#', icon: Facebook },
    { href: '#', icon: Twitter },
    { href: '#', icon: Instagram },
    { href: '#', icon: Linkedin },
  ];

  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Heart className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold text-white">GiveEase</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Connecting verified donors with recipients and NGOs to create meaningful impact through secure, transparent donations.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  >
                    <Icon className="text-white h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2024 GiveEase. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Secured with SSL</span>
            <Shield className="text-primary h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
