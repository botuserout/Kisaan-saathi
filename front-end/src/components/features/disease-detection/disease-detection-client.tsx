'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  X,
  Aperture,
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState, useActionState, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { useFormStatus } from 'react-dom';
import { detectDisease, type DiseaseDetectionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const initialState: DiseaseDetectionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Disease'
      )}
    </Button>
  );
}

export default function DiseaseDetectionClient() {
  const [state, formAction] = useActionState(detectDisease, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
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

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        variant: 'destructive',
        title: 'Camera Error',
        description:
          'Could not access camera. Please make sure you have granted permission.',
      });
      setIsCameraOpen(false);
    }
  };

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraOpen]); // Removed stopCamera from dependency array to avoid loop, it's stable via useCallback but safe to omit or careful include

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', {
              type: 'image/jpeg',
            });

            // Update file input using DataTransfer
            if (fileInputRef.current) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              fileInputRef.current.files = dataTransfer.files;

              // Read for preview
              const reader = new FileReader();
              reader.onloadend = () => {
                setImagePreview(reader.result as string);
              };
              reader.readAsDataURL(file);
              setFileToUpload(file);
              setIsCameraOpen(false);
            }
          }
        }, 'image/jpeg');
      }
    }
  };

  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  useEffect(() => {
    if (state?.error && !state.formErrors) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleSubmit = async () => {
    if (!fileToUpload) return;
    setUploading(true);

    // Safety timeout to prevent infinite loading state
    const safetyTimeout = setTimeout(() => {
      if (uploading) {
        setUploading(false);
        toast({
          variant: 'destructive',
          title: "Process Timed Out",
          description: "The operation took too long. Please try again."
        });
      }
    }, 45000);

    try {
      // 1. Upload Image
      const { imageUrl } = await import('@/lib/upload-service').then(m => m.uploadImage(fileToUpload, token));

      // 2. Prepare Form Data
      const formData = new FormData();
      formData.append('imageUrl', imageUrl);
      formData.append('token', token);

      // 3. Trigger Server Action
      startTransition(() => {
        formAction(formData);
        // Note: formAction is void, so we rely on useActionState to update `state`.
        // We will clear uploading state in useEffect when state changes.
      });

    } catch (error: any) {
      console.error("Submission Error:", error.message);
      toast({
        variant: 'destructive',
        title: "Upload Failed",
        description: error.message || "Could not upload image for analysis."
      });
      setUploading(false); // Explicitly clear loading on catch
    } finally {
      clearTimeout(safetyTimeout);
      // Note: We DO NOT setUploading(false) here if successful, 
      // because we want to keep loading until the server action returns new UI.
      // We'll handle cleanup in a useEffect watching `state`.
    }
  };

  // 4. Force clear loading when we get a result or error from the server action
  useEffect(() => {
    if (state?.result || state?.error || state?.formErrors) {
      setUploading(false);
    }
  }, [state]);

  // We need to move useTransition up
  const [isPending, startTransition] = React.useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const placeholderImage = PlaceHolderImages.find(
    (p) => p.id === 'disease-detection-placeholder'
  );

  return (
    <div className="space-y-8">
      {!state?.result && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Upload a Leaf Image</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Take a clear photo of the plant leaf for analysis. Ensure good lighting and a clear background.
            </p>
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="token" value={token} />
              <div className="space-y-2">
                <Label htmlFor="image-upload" className="sr-only">
                  Upload Image
                </Label>
                <div
                  className={cn(
                    'relative aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center overflow-hidden',
                    { 'border-destructive': state?.formErrors?.image }
                  )}
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Selected leaf"
                      layout="fill"
                      objectFit="contain"
                    />
                  ) : (
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
                  )}
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full h-8 w-8"
                      onClick={handleClearImage}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear image</span>
                    </Button>
                  )}
                </div>
                <Input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                {state?.formErrors?.image && (
                  <p className="text-sm text-destructive">{state.formErrors.image[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <ImageIcon className="mr-2 h-4 w-4" /> Gallery
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCameraOpen(true)}
                  disabled={uploading}
                >
                  <Camera className="mr-2 h-4 w-4" /> Camera
                </Button>
              </div>

              {imagePreview && (
                <Button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading & Analyzing...
                    </>
                  ) : (
                    'Analyze Disease'
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {state?.result && (
        <div className="animate-in fade-in duration-500 space-y-6">
          <Alert
            variant={
              state.result.confidence > 75 ? 'default' : 'destructive'
            }
            className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 text-green-800 dark:text-green-200 [&>svg]:text-green-600"
          >
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle className="font-bold">Analysis Complete</AlertTitle>
            <AlertDescription>
              We've identified a potential issue with your plant.
            </AlertDescription>
          </Alert>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">{state.result.diseaseName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
                <Label>Confidence</Label>
                <Progress value={state.result.confidence} />
                <p className="text-sm text-muted-foreground text-right">{state.result.confidence}% Match</p>
              </div>

              <Accordion type="single" collapsible defaultValue="symptoms" className="w-full">
                <AccordionItem value="symptoms">
                  <AccordionTrigger>Symptoms & Signs</AccordionTrigger>
                  <AccordionContent>
                    {state.result.symptoms}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="crops">
                  <AccordionTrigger>Commonly Affected Crops</AccordionTrigger>
                  <AccordionContent>
                    {state.result.affectedCrops}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="treatment">
                  <AccordionTrigger>Organic Treatments</AccordionTrigger>
                  <AccordionContent>
                    {state.result.organicTreatments}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          <Button onClick={() => window.location.reload()} className="w-full">
            Analyze Another Plant
          </Button>
        </div>
      )}
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take a Photo</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex justify-center">
            <Button onClick={captureImage} size="lg" className="rounded-full h-16 w-16 p-0">
              <Aperture className="h-8 w-8" />
              <span className="sr-only">Capture</span>
            </Button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
