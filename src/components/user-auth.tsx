
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

export function UserAuth() {
  const { user, login, signup, logout } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    try {
      login(name, password);
      toast({ title: 'Login Successful!', description: `Welcome back, ${name}!` });
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = () => {
    setError(null);
    if (!name || !password) {
        setError('Name and password cannot be empty.');
        return;
    }
    try {
      signup(name, password);
      toast({ title: 'Account Created!', description: `Welcome, ${name}!` });
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <DialogHeader>
                <DialogTitle>Log In</DialogTitle>
                <DialogDescription>Access your reading streak.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="login-name" className="text-right">
                    Name
                  </Label>
                  <Input id="login-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="login-password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-right">
                    Password
                  </Label>
                  <Input id="login-password" type="password" className="col-span-3" />
                </div>
                {error && <p className="text-destructive text-sm text-center col-span-4">{error}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleLogin}>Log In</Button>
              </DialogFooter>
            </TabsContent>
            <TabsContent value="signup">
               <DialogHeader>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogDescription>Create an account to start tracking your streak.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="signup-name" className="text-right">
                    Name
                  </Label>
                  <Input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="signup-password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-right">
                    Password
                  </Label>
                  <Input id="signup-password" type="password" className="col-span-3" />
                </div>
                 {error && <p className="text-destructive text-sm text-center col-span-4">{error}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSignup}>Sign Up</Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
