import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, Users, FileText } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const isAdminPage = ['Admin', 'Sessions'].includes(currentPageName);

  if (!isAdminPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', path: 'Admin', icon: LayoutDashboard },
    { name: 'Sessions', path: 'Sessions', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png" 
                alt="ParlerEmploi" 
                className="h-12 object-contain"
              />
              <div className="flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPageName === item.path
                        ? 'bg-[#17c3b2] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}