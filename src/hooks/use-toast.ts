"use client";

import { useState, useCallback } from "react";

type ToastVariant = "default" | "destructive" | "success";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastInput = Omit<Toast, "id">;

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let currentToasts: Toast[] = [];

function updateToasts(newToasts: Toast[]) {
  currentToasts = newToasts;
  toastListeners.forEach((l) => l(currentToasts));
}

export function toast(input: ToastInput) {
  const id = Math.random().toString(36).slice(2);
  const newToast: Toast = { id, duration: 5000, ...input };
  updateToasts([...currentToasts, newToast]);

  setTimeout(() => {
    updateToasts(currentToasts.filter((t) => t.id !== id));
  }, newToast.duration);

  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(currentToasts);

  const subscribe = useCallback(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  }, []);

  if (!toastListeners.includes(setToasts)) {
    toastListeners.push(setToasts);
  }

  const dismiss = useCallback((id: string) => {
    updateToasts(currentToasts.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss, subscribe };
}
