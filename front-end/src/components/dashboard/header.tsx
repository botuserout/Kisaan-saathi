'use client';

import { Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import SideNavTools from './side-nav-tools';

import { useLocation } from '@/hooks/use-location';
import { LocateFixed, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useTranslation } from 'react-i18next';

export default function DashboardHeader() {
  const { city, loading } = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* ... Sheet ... */}
        {/* Simplified for brevity in replacement, assuming surrounding code is preserved or this replaces the component body logic */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 rounded-full h-10 w-10 bg-white border-none shadow-sm text-primary">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
            <SheetHeader className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Logo />
                <SheetTitle>Kisan Saathi</SheetTitle>
              </div>
            </SheetHeader>
            <div className="py-4">
              <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">More Tools</h3>
              <SideNavTools />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground hidden sm:block">Kisan Saathi</h1>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full gap-1.5 h-auto py-1 px-3 text-xs font-medium bg-muted hover:bg-muted/80">
              <span className="uppercase">{i18n.language === 'bho' ? 'भोजपुरी' : i18n.language === 'or' ? 'ଓଡ଼ିଆ' : i18n.language === 'kn' ? 'ಕನ್ನಡ' : i18n.language === 'ml' ? 'മലയാളം' : i18n.language === 'hi' ? 'हिंदी' : i18n.language === 'gu' ? 'ગુજરાતી' : 'English'}</span>
              <span className="opacity-50 text-[10px]">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('hi')}>हिंदी (Hindi)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('gu')}>ગુજરાતી (Gujarati)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('or')}>ଓଡ଼ିଆ (Odia)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('bho')}>भोजपुरी (Bhojpuri)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('kn')}>ಕನ್ನಡ (Kannada)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('ml')}>മലയാളം (Malayalam)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-1 border shadow-sm rounded-full px-3 py-1 text-xs font-semibold w-full justify-center transition-colors bg-white text-primary`}>
              <span>📍</span>
              <span>{loading ? 'Locating...' : city}</span>
              <span className="opacity-50 ml-1">▼</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => window.location.reload()} className="cursor-pointer gap-2">
              <LocateFixed className="h-4 w-4" />
              <span>Use Current Location</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="gap-2 opacity-50">
              <RefreshCw className="h-4 w-4" />
              <span>Change City (Coming Soon)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
