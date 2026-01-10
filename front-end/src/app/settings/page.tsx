import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, LogOut, User, Languages, Info } from 'lucide-react';
import LanguageSwitcher from '@/components/features/settings/language-switcher';
import Link from 'next/link';

export const metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <button className="flex items-center justify-between w-full text-left p-3 -m-3 rounded-lg hover:bg-accent">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-full">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Profile Information</p>
                <p className="text-sm text-muted-foreground">Manage your account details</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>
      
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LanguageSwitcher />
           <Link href="/about" className="flex items-center justify-between w-full text-left p-3 -m-3 rounded-lg hover:bg-accent">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-full">
                <Info className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">About Krishi Sakhi</p>
                <p className="text-sm text-muted-foreground">Learn more about the app</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      <div className="pt-4">
        <Button variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
