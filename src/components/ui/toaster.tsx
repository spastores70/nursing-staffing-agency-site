"use client";

import { useToast } from "@/hooks/use-toast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "relative flex items-start gap-3 rounded-xl border bg-background p-4 shadow-lg",
              toast.variant === "destructive" && "border-destructive/50 bg-destructive/5",
              toast.variant === "success" && "border-green-500/50 bg-green-50"
            )}
          >
            {toast.variant === "success" && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
            {toast.variant === "destructive" && <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />}
            {!toast.variant && <Info className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
              {toast.description && <p className="text-sm text-muted-foreground mt-0.5">{toast.description}</p>}
            </div>

            <button
              onClick={() => dismiss(toast.id)}
              className="flex-shrink-0 p-0.5 rounded hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
