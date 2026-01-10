'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCropRecommendation, type CropRecommendationState } from '@/app/actions';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sprout, WandSparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: CropRecommendationState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Recommendations...
        </>
      ) : (
        <>
          <WandSparkles className="mr-2 h-4 w-4" />
          Recommend Crops
        </>
      )}
    </Button>
  );
}

export default function CropRecommendationClient() {
  const [state, formAction] = useActionState(getCropRecommendation, initialState);
  const { toast } = useToast();
  const [token, setToken] = useState("");

  useEffect(() => {
    // Wait for auth to initialize or check current user
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const t = await user.getIdToken();
        setToken(t);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Recommendation Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  const getErrorForField = (field: string) => {
    return state.formErrors?.find(e => e.path[0] === field)?.message;
  }

  if (state.result) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200 [&>svg]:text-green-600">
          <Sprout className="h-4 w-4" />
          <AlertTitle className="font-bold">Here are your crop recommendations!</AlertTitle>
        </Alert>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Recommended Crops</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {state.result.recommendedCrops.map((crop: string) => (
                <Badge key={crop} variant="secondary" className="text-base px-3 py-1">{crop}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Reasoning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{state.result.reasoning}</p>
          </CardContent>
        </Card>
        <Button onClick={() => window.location.reload()} className="w-full">
          Start Over
        </Button>
      </div>
    )
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Farm Details</CardTitle>
        <p className="text-muted-foreground pt-2">
          Provide details about your farm to get personalized crop recommendations.
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="token" value={token} />
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="e.g., Mangalagiri, Andhra Pradesh" />
            {getErrorForField('location') && <p className="text-sm text-destructive">{getErrorForField('location')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="soilAnalysis">Soil Analysis</Label>
            <Textarea
              id="soilAnalysis"
              name="soilAnalysis"
              placeholder="e.g., pH: 6.5, Nitrogen: High, Phosphorus: Medium, Potassium: Low"
            />
            {getErrorForField('soilAnalysis') && <p className="text-sm text-destructive">{getErrorForField('soilAnalysis')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="weatherData">Local Weather</Label>
            <Textarea
              id="weatherData"
              name="weatherData"
              placeholder="e.g., Avg. Temp: 28°C, Annual Rainfall: 900mm, Sunny days: 250"
            />
            {getErrorForField('weatherData') && <p className="text-sm text-destructive">{getErrorForField('weatherData')}</p>}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
