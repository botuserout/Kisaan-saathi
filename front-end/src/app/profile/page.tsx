"use client";

import { useAuth } from "@/components/auth/auth-provider";
import AuthGuard from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/page-header";
import { LogOut, User, Mail, Shield, Settings } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    if (!user) return null; // AuthGuard handles redirect

    return (
        <AuthGuard>
            <div className="space-y-6">
                <PageHeader title="My Profile" />

                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">{user.displayName || "Farmer"}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Full Name</p>
                                <p className="text-sm text-muted-foreground">{user.displayName || "Not set"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Email Address</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Account ID</p>
                                <p className="text-xs text-muted-foreground font-mono">{user.uid}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start text-muted-foreground"
                            disabled
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            App Settings (Coming Soon)
                        </Button>
                    </CardContent>
                </Card>

                <Button
                    variant="destructive"
                    className="w-full h-12 text-lg"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign Out
                </Button>

            </div>
        </AuthGuard>
    );
}
