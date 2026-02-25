'use client'

import { useState } from 'react'
import { Menu, X, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/data/site'

const navLinks = [
  { label: 'Trail Guide', href: '#about' },
  { label: 'Trail Log', href: '#experience' },
  { label: 'Gear', href: '#skills' },
  { label: 'Lodge', href: '#services' },
  { label: 'Credentials', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-bark/10">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a
          href="#"
          className="group flex items-center gap-2 font-serif text-xl font-semibold text-forest transition-colors hover:text-forest/80"
        >
          <Compass className="h-5 w-5 text-gold transition-transform duration-500 group-hover:rotate-45" />
          {siteConfig.name}
        </a>

        {/* Desktop links */}
        <ul className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative text-sm text-bark transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:text-gold hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="text-bark md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={cn(
          'overflow-hidden border-b border-bark/10 md:hidden',
          mobileOpen ? 'block' : 'hidden',
        )}
      >
        <ul className="mx-auto flex max-w-5xl flex-col gap-1 px-6 pb-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm text-bark transition-colors hover:bg-sand/50 hover:text-gold"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
