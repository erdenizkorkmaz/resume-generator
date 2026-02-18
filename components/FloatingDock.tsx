'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    ),
    label: 'Home',
  },
  {
    href: '/jobs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    label: 'Jobs',
  },
];

export default function FloatingDock() {
  const pathname = usePathname();

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/50 p-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative group p-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-sky-100 text-sky-600' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              {item.icon}
              
              <!-- Tooltip -->
              <span className="
                absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded-md
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 whitespace-nowrap
                top-1/2 -translate-y-1/2
              ">
                {item.label}
                <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
