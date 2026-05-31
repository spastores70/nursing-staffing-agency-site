"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { resetPasswordRequestSchema, resetPasswordSchema } from "@/lib/validators";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Request form
  const requestForm = useForm({ resolver: zodResolver(resetPasswordRequestSchema) });
  // Reset form
  const resetForm = useForm({ resolver: zodResolver(resetPasswordSchema) });

  async function onRequestSubmit(data: { email: string }) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setSuccess(true);
      else {
        const json = await res.json();
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetSubmit(data: { token: string; password: string; confirmPassword: string }) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      if (res.ok) {
        setSuccess(true);
        toast({ title: "Password reset!", description: "You can now sign in with your new password.", variant: "success" });
      } else {
        const json = await res.json();
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <Card className="shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold">
            {token ? "Set New Password" : "Reset Password"}
          </CardTitle>
          <CardDescription>
            {token
              ? "Enter your new password below"
              : "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className="text-muted-foreground">
                {token
                  ? "Your password has been reset successfully."
                  : "Check your email for a password reset link. It expires in 1 hour."}
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          ) : token ? (
            <form onSubmit={resetForm.handleSubmit((d) => onResetSubmit(d as any))} className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                  error={(resetForm.formState.errors as any).password?.message}
                  {...resetForm.register("password")}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={(resetForm.formState.errors as any).confirmPassword?.message}
                  {...resetForm.register("confirmPassword")}
                />
              </div>
              <Button type="submit" className="w-full" loading={isLoading}>Reset Password</Button>
            </form>
          ) : (
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={(requestForm.formState.errors as any).email?.message}
                  {...requestForm.register("email")}
                />
              </div>
              <Button type="submit" className="w-full" loading={isLoading}>Send Reset Link</Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-brand-600 hover:underline">Back to login</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
