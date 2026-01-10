"use client";

import { useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Leaf, Tractor, Sprout } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For signup

  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    // ... existing logic ...
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(redirectUrl || "/chat");
    } catch (err: any) {
      setError(mapAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    // ... existing logic ...
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Ideally update profile name here
      router.push(redirectUrl || "/chat");
    } catch (err: any) {
      setError(mapAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    // ... existing logic ...
    if (!email) {
      setError("Please enter your email address first."); // Could translate alerts too, but start with UI
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err: any) {
      setError(mapAuthError(err.code));
    }
  };

  // ... handleGoogleLogin and mapAuthError ...
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(redirectUrl || "/chat");
    } catch (err: any) {
      setError(mapAuthError(err.code));
    }
  };

  const mapAuthError = (code: string) => {
    switch (code) {
      case "auth/invalid-email": return "Invalid email address.";
      case "auth/user-disabled": return "This account has been disabled.";
      case "auth/user-not-found": return "No account found with this email.";
      case "auth/wrong-password": return "Incorrect password.";
      case "auth/invalid-credential": return "Invalid email or password.";
      case "auth/email-already-in-use": return "Email is already registered.";
      case "auth/weak-password": return "Password should be at least 6 characters.";
      case "auth/operation-not-allowed": return "This sign-in method is not enabled. Please contact support.";
      case "auth/too-many-requests": return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed": return "Network error. Please check your internet connection.";
      default: return `An error occurred (${code}). Please try again.`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-900 tracking-tight">{t('app_name')}</h1>
          <p className="text-green-700 mt-2">{t('app_tagline')}</p>
        </div>

        <Card className="border-green-100 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center">{t('login_welcome')}</CardTitle>
            <CardDescription className="text-center">
              {t('login_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t('login_tab')}</TabsTrigger>
                <TabsTrigger value="signup">{t('signup_tab')}</TabsTrigger>
              </TabsList>

              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email_label')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="farmer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t('password_label')}</Label>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"
                        onClick={handleResetPassword}
                      >
                        {t('forgot_password')}
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('logging_in') : t('login_btn')}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t('name_label')}</Label>
                    <Input
                      id="signup-name"
                      placeholder="Kishan Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('email_label')}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="farmer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('password_label')}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('signing_up') : t('signup_btn')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full text-center text-sm text-muted-foreground">
              <span className="bg-white px-2 relative z-10">{t('or_continue')}</span>
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Google
            </Button>
          </CardFooter>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-green-800 opacity-80">
          <div className="flex flex-col items-center gap-1">
            <Sprout className="h-5 w-5" />
            <span>{t('feature_advice')}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Tractor className="h-5 w-5" />
            <span>{t('feature_tools')}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Leaf className="h-5 w-5" />
            <span>{t('feature_community')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
