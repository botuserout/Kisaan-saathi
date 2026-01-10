import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function FertilizerRecommendationPage() {
  return (
    <div>
      <PageHeader title="Fertilizer Recommendation" />
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Soil & Crop Details</CardTitle>
          <CardDescription>
            Enter details to get a fertilizer recommendation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="crop">Current Crop</Label>
              <Input id="crop" placeholder="e.g., Tomato" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soil">Soil Analysis</Label>
              <Textarea
                id="soil"
                placeholder="e.g., pH: 6.2, Nitrogen: Low, Phosphorus: High"
              />
            </div>
            <Button disabled className="w-full">
              Get Recommendation (Coming Soon)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
