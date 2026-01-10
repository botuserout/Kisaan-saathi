import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, ArrowRight } from 'lucide-react';
import AuthGuard from '@/components/auth/auth-guard';

export const metadata = {
  title: 'Government Schemes',
};

const schemes = [
  {
    title: 'PM-KISAN Scheme',
    description: 'Financial support of ₹6,000 per year to all landholding farmer families.',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
  },
  {
    title: 'Kisan Credit Card (KCC)',
    description: 'Provides farmers with timely access to credit for their cultivation and other needs.',
    ministry: 'Ministry of Finance',
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
  },
  {
    title: 'Soil Health Card Scheme',
    description: 'Assists farmers to issue Soil Health Cards to all farmers in the country.',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
  },
];

export default function SchemesPage() {
  return (
    <AuthGuard>
      <div className="space-y-8">
        <PageHeader title="Government Schemes" />
        <div className="grid gap-6 md:grid-cols-2">
          {schemes.map((scheme) => (
            <Card key={scheme.title} className="flex flex-col rounded-2xl">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle>{scheme.title}</CardTitle>
                  <div className="p-3 bg-muted rounded-full">
                    <Landmark className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{scheme.description}</p>
              </CardContent>
              <CardFooter className='flex-col items-start gap-4'>
                <p className='text-xs text-muted-foreground'>{scheme.ministry}</p>
                <Button variant="outline" className="w-full">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
