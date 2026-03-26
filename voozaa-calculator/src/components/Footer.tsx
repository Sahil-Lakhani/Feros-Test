import { useEffect, useRef, useState } from 'react';
import logoDark from '../assets/Logo-Dark.png';
import logoLight from '../assets/Logo-Light.png';

interface FooterProps {
  isDark: boolean;
}

const infoLinks = ['Home', 'Partner werden', 'Werbetreibende', 'Franchise', 'Über Uns', 'Kontakt'];
const legalLinks = ['Datenschutz', 'AGB', 'Impressum'];

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.21 8.21 0 004.79 1.52V6.78a4.85 4.85 0 01-1.02-.09z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/voltspot.io', Icon: InstagramIcon },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@voltspot.io',   Icon: TikTokIcon },
  { label: 'Facebook',  href: 'https://www.facebook.com/voltspot.io',  Icon: FacebookIcon },
  { label: 'Threads',   href: 'https://www.threads.net/@voltspot.io',  Icon: ThreadsIcon },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/voltspot', Icon: LinkedInIcon },
];

export function Footer({ isDark }: FooterProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const fadeUp = (delay: number, extra = '') => ({
    className: `${extra} transition-all duration-700 ease-out ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <footer
      ref={ref}
      className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">

        {/* Top: logo + tagline + socials */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-8">

          {/* Logo + tagline */}
          <div {...fadeUp(0)}>
            <a
              href="https://www.voltspot.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity duration-200"
            >
              <img
                src={isDark ? logoDark : logoLight}
                alt="VoltSpot"
                className="h-10 w-auto object-contain"
              />
            </a>
            <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
              Die smarte Powerbank-Sharing-Lösung für moderne Standorte
            </p>
          </div>

          {/* Social icons */}
          <div {...fadeUp(150, 'flex items-center gap-2 flex-wrap')}>
            {socialLinks.map(({ label, href, Icon }, i) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ transitionDelay: `${200 + i * 60}ms` }}
                className={`w-9 h-9 flex items-center justify-center rounded-full
                  border border-gray-300 dark:border-zinc-700
                  text-zinc-500 dark:text-zinc-400
                  hover:border-[#C2410C] hover:text-[#C2410C]
                  dark:hover:border-amber-400 dark:hover:text-amber-400
                  hover:scale-110 hover:shadow-md hover:shadow-orange-500/20
                  transition-all duration-200 ease-out
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Animated divider */}
        <div
          className={`h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent mb-10 transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ transitionDelay: '400ms', transformOrigin: 'center' }}
        />

        {/* 4-column grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Adresse */}
          <div {...fadeUp(500)}>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-wide">
              Adresse
            </h3>
            <div className="space-y-1 text-base text-zinc-500 dark:text-zinc-400">
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">Voltspot</p>
              <p>c/o MDC Management#5836</p>
              <p>Welserstraße 3</p>
              <p>87463 Dietmannsried</p>
            </div>
            <div className="mt-5">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1 tracking-wide">
                E-mail
              </h4>
              <a
                href="mailto:info@voltspot.io"
                className="text-base text-zinc-500 dark:text-zinc-400 hover:text-[#C2410C] dark:hover:text-amber-400 transition-colors duration-200"
              >
                info@voltspot.io
              </a>
            </div>
          </div>

          {/* Info */}
          <div {...fadeUp(600)}>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-wide">
              Info
            </h3>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link}>
                  <a
                    href="https://www.voltspot.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-zinc-500 dark:text-zinc-400 hover:text-[#C2410C] dark:hover:text-amber-400 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-200 text-[#C2410C] dark:text-amber-400 text-xs">›</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div {...fadeUp(700)}>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link}>
                  <a
                    href="https://www.voltspot.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-zinc-500 dark:text-zinc-400 hover:text-[#C2410C] dark:hover:text-amber-400 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-200 text-[#C2410C] dark:text-amber-400 text-xs">›</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA card */}
          <div {...fadeUp(800, 'col-span-2 lg:col-span-1')}>
            <a
              href="mailto:info@voltspot.io"
              className="flex items-center gap-4 p-5 rounded-2xl
                bg-transparent
                border-2 border-[#C2410C] dark:border-amber-500
                hover:bg-[#C2410C]/5 dark:hover:bg-amber-500/10
                hover:scale-[1.03]
                hover:shadow-lg hover:shadow-orange-500/15 dark:hover:shadow-amber-500/15
                transition-all duration-300 ease-out group"
            >
              <div className="w-11 h-11 rounded-full border border-[#C2410C] dark:border-amber-500 flex items-center justify-center flex-shrink-0 group-hover:rotate-12 group-hover:bg-[#C2410C] dark:group-hover:bg-amber-500 transition-all duration-300">
                <svg className="w-5 h-5 text-[#C2410C] dark:text-amber-500 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">Schreiben Sie uns</p>
                <p className="text-sm text-[#C2410C] dark:text-amber-500 mt-0.5">info@voltspot.io</p>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          {...fadeUp(900, 'mt-10 pt-6 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2')}
        >
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} VoltSpot. Alle Rechte vorbehalten.
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            Powerbank-Sharing-Lösung
          </p>
        </div>

      </div>
    </footer>
  );
}
