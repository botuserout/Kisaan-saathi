import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Camera, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function PestDetectionPage() {
  const placeholderImage = PlaceHolderImages.find(
    (p) => p.id === 'disease-detection-placeholder'
  );

  return (
    <div>
      <PageHeader title="Pest Detection" />
      <div className="space-y-8">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Upload an Image</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Take a clear photo of the pest or affected plant area for analysis.
            </p>
            <div className="space-y-6">
              <div className="relative aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center overflow-hidden">
                <div className="text-center text-muted-foreground p-4">
                  {placeholderImage && (
                    <Image
                      src={placeholderImage.imageUrl}
                      alt={placeholderImage.description}
                      width={200}
                      height={133}
                      className="mx-auto rounded-md opacity-30"
                      data-ai-hint={placeholderImage.imageHint}
                    />
                  )}
                  <p className="mt-2">Image preview will appear here</p>
                </div>
              </div>
              <Input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline">
                  <ImageIcon className="mr-2 h-4 w-4" /> Gallery
                </Button>
                <Button type="button" variant="outline">
                  <Camera className="mr-2 h-4 w-4" /> Camera
                </Button>
              </div>

              <Button disabled className="w-full">
                Analyze Pest (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
