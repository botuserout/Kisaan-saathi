'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronRight, Languages } from 'lucide-react';
import { useState } from 'react';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'ml', label: 'മലയാളം' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ' },
];

export default function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-between w-full text-left p-3 -m-3 rounded-lg hover:bg-accent">
          <div className="flex items-center gap-4">
            <div className="bg-muted p-3 rounded-full">
              <Languages className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Language</p>
              <p className="text-sm text-muted-foreground">Change the app language</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">English</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
        </DialogHeader>
        <RadioGroup
          value={selectedLanguage}
          onValueChange={setSelectedLanguage}
          className="space-y-2 py-4"
        >
          {languages.map((lang) => (
            <Label
              key={lang.value}
              htmlFor={`lang-${lang.value}`}
              className="flex items-center justify-between p-4 rounded-lg border has-[:checked]:bg-accent has-[:checked]:border-primary"
            >
              <span>{lang.label}</span>
              <RadioGroupItem value={lang.value} id={`lang-${lang.value}`} />
            </Label>
          ))}
        </RadioGroup>
        <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
}
