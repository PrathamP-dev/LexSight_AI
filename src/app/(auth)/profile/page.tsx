
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LegalMindLogo } from "@/components/icons";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
    return (
        <>
            <div className="dark-veil"></div>
            <div className="relative flex min-h-screen w-full items-center justify-center p-4">
                <Link href="/dashboard" className="absolute top-4 left-4">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
                <Card className="mx-auto w-full max-w-2xl shadow-xl border-2 border-primary/10 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <div className="flex justify-center items-center gap-3 mb-2">
                            <LegalMindLogo className="h-9 w-9 text-primary" />
                            <CardTitle className="font-headline text-4xl">LegalMind</CardTitle>
                        </div>
                        <CardDescription>User Profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-6">
                            <Avatar className="size-24 border-4 border-primary/20">
                                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="grid w-full gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" defaultValue="Test User" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue="user@example.com" />
                                </div>
                                <Separator />
                                <div className="grid gap-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" placeholder="********" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" placeholder="Enter new password" />
                                </div>
                                <Button className="w-full font-headline mt-2">
                                    Update Profile
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
