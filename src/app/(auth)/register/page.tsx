"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, User, Mail, Lock, Building2, Phone, Chrome } from "lucide-react";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") as "NURSE" | "FACILITY" || "NURSE";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast({ title: "Registration failed", description: json.error, variant: "destructive" });
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/register/pending");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>Join thousands of healthcare professionals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-muted rounded-lg">
            {(["NURSE", "FACILITY"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue("role", role)}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
                  selectedRole === role
                    ? "bg-white shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {role === "NURSE" ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                {role === "NURSE" ? "I'm a Nurse" : "I'm a Facility"}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => { setIsGoogleLoading(true); signIn("google", { callbackUrl: "/register/pending" }); }}
            loading={isGoogleLoading}
          >
            <Chrome className="h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name {selectedRole === "FACILITY" && "(Contact Person)"}</Label>
              <Input placeholder="John Smith" leftIcon={<User className="h-4 w-4" />} error={errors.name?.message} {...register("name")} />
            </div>

            {selectedRole === "FACILITY" && (
              <div className="space-y-2">
                <Label>Facility Name</Label>
                <Input placeholder="City Medical Center" leftIcon={<Building2 className="h-4 w-4" />} error={errors.facilityName?.message} {...register("facilityName")} />
              </div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" leftIcon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register("email")} />
            </div>

            <div className="space-y-2">
              <Label>Phone (Optional)</Label>
              <Input type="tel" placeholder="+1 (555) 000-0000" leftIcon={<Phone className="h-4 w-4" />} {...register("phone")} />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...register("password")}
              />
              <p className="text-xs text-muted-foreground">Min 8 chars, uppercase, number, special character</p>
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            By registering you agree to our{" "}
            <Link href="/terms" className="text-brand-600 hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-600 hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
