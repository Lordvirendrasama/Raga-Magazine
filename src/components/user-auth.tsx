
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.533,44,29.898,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
</svg>
);


export function UserAuth() {
  const { user, login, signup, logout, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      await login(email, password);
      toast({ title: 'Login Successful!', description: `Welcome back!` });
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    setError(null);
    if (!email || !password) {
        setError('Email and password cannot be empty.');
        return;
    }
    try {
      await signup(email, password);
      toast({ title: 'Account Created!', description: `Welcome!` });
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      // No need to handle toast or dialog here, as the page will redirect.
    } catch (err: any) {
        setError(err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  }
  
  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEmail('');
      setPassword('');
      setError(null);
    }
    setIsDialogOpen(open);
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground hidden md:inline">
          Hi, {user.name}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
        Log In
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <div className="px-6 py-4">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </div>
            
            <div className="relative px-6">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-background px-2 text-xs text-muted-foreground">OR</span>
            </div>

            <TabsContent value="login">
              <DialogHeader className="text-center">
                <DialogTitle>Log In</DialogTitle>
                <DialogDescription>Access your reading streak.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 px-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="login-email">
                    Email
                  </Label>
                  <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="login-password">
                    Password
                  </Label>
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
              </div>
              <DialogFooter className="px-6 pb-4">
                <Button type="submit" className="w-full" onClick={handleLogin}>Log In</Button>
              </DialogFooter>
            </TabsContent>
            <TabsContent value="signup">
               <DialogHeader className="text-center">
                <DialogTitle>Sign Up</DialogTitle>
                <DialogDescription>Create an account to start tracking your streak.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 px-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="signup-email">
                    Email
                  </Label>
                  <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="signup-password">
                    Password
                  </Label>
                  <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                 {error && <p className="text-destructive text-sm text-center">{error}</p>}
              </div>
              <DialogFooter className="px-6 pb-4">
                <Button type="submit" className="w-full" onClick={handleSignup}>Sign Up</Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
