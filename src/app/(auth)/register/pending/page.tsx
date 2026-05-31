import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, CheckCircle, Mail } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="shadow-lg border-0 text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Account Under Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Thank you for registering! Your account is being reviewed by our team. You&apos;ll receive an email once it&apos;s approved (usually within 24 hours).
          </p>

          <div className="space-y-3 text-left">
            {[
              { icon: CheckCircle, text: "Account created successfully", done: true },
              { icon: Clock, text: "Admin review in progress", done: false },
              { icon: Mail, text: "Approval email will be sent", done: false },
            ].map(({ icon: Icon, text, done }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className={`h-5 w-5 flex-shrink-0 ${done ? "text-green-500" : "text-muted-foreground"}`} />
                <span className={`text-sm ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Need help? <Link href="/support" className="text-brand-600 hover:underline">Contact support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
