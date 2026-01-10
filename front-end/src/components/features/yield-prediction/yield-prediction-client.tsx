'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getYieldPrediction, type YieldPredictionState } from '@/app/actions';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LineChart, WandSparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: YieldPredictionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Predicting Yield...
        </>
      ) : (
        <>
          <WandSparkles className="mr-2 h-4 w-4" />
          Predict Yield
        </>
      )}
    </Button>
  );
}

export default function YieldPredictionClient() {
  const [state, formAction] = useActionState(getYieldPrediction, initialState);
  const { toast } = useToast();
  const [token, setToken] = useState("");

  useEffect(() => {
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
        title: 'Prediction Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  const getErrorForField = (field: string) => {
    return state.formErrors?.find((e: any) => e.path[0] === field)?.message;
  }

  if (state.result) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200 [&>svg]:text-green-600">
          <LineChart className="h-4 w-4" />
          <AlertTitle className="font-bold">Yield Prediction Complete</AlertTitle>
        </Alert>

        <Card className="rounded-2xl text-center">
          <CardHeader>
            <CardTitle>Estimated Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary">{state.result.estimatedYield.toLocaleString()}</p>
            <p className="text-muted-foreground">Tons</p>
            <p className="text-sm text-muted-foreground mt-2">Confidence: {state.result.confidenceInterval}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Influencing Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{state.result.factorsInfluencingYield}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{state.result.recommendations}</p>
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
        <CardTitle>Farm & Crop Data</CardTitle>
        <p className="text-muted-foreground pt-2">
          Enter your farm's data to get an AI-powered yield prediction.
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="token" value={token} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Input id="cropType" name="cropType" placeholder="e.g., Wheat, Corn" />
              {getErrorForField('cropType') && <p className="text-sm text-destructive">{getErrorForField('cropType')}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmSize">Farm Size (in acres)</Label>
              <Input id="farmSize" name="farmSize" type="number" step="0.1" placeholder="e.g., 10.5" />
              {getErrorForField('farmSize') && <p className="text-sm text-destructive">{getErrorForField('farmSize')}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type</Label>
            <Input id="soilType" name="soilType" placeholder="e.g., Loamy, Clay" />
            {getErrorForField('soilType') && <p className="text-sm text-destructive">{getErrorForField('soilType')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fertilizerUsed">Fertilizer Used</Label>
            <Input id="fertilizerUsed" name="fertilizerUsed" placeholder="e.g., Urea, NPK 20-20-20" />
            {getErrorForField('fertilizerUsed') && <p className="text-sm text-destructive">{getErrorForField('fertilizerUsed')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="historicalYieldData">Historical Yield Data</Label>
            <Textarea id="historicalYieldData" name="historicalYieldData" placeholder="e.g., 5 tons last year, 4.8 tons year before" />
            {getErrorForField('historicalYieldData') && <p className="text-sm text-destructive">{getErrorForField('historicalYieldData')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentWeatherData">Current Weather Data</Label>
            <Textarea id="currentWeatherData" name="currentWeatherData" placeholder="e.g., Good rainfall this season, average temperature 29°C" />
            {getErrorForField('currentWeatherData') && <p className="text-sm text-destructive">{getErrorForField('currentWeatherData')}</p>}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
