import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryRange(min?: number | null, max?: number | null, unit = "YEAR") {
  if (!min && !max) return "Salary not specified";
  const unitLabel: Record<string, string> = {
    HOUR: "/hr",
    DAY: "/day",
    WEEK: "/wk",
    MONTH: "/mo",
    YEAR: "/yr",
  };
  const suffix = unitLabel[unit] || "/yr";
  if (min && max) return `${formatCurrency(min)}–${formatCurrency(max)}${suffix}`;
  if (min) return `From ${formatCurrency(min)}${suffix}`;
  return `Up to ${formatCurrency(max!)}${suffix}`;
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

export function timeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `INV-${year}${month}-${rand}`;
}

export function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatJobType(type: string) {
  return type.replace(/_/g, " ").split(" ").map(capitalize).join(" ");
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    SUSPENDED: "bg-red-100 text-red-800",
    REJECTED: "bg-red-100 text-red-800",
    OPEN: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
    FILLED: "bg-blue-100 text-blue-800",
    DRAFT: "bg-gray-100 text-gray-600",
    REVIEWED: "bg-blue-100 text-blue-800",
    SHORTLISTED: "bg-purple-100 text-purple-800",
    INTERVIEW_SCHEDULED: "bg-indigo-100 text-indigo-800",
    OFFERED: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    WITHDRAWN: "bg-gray-100 text-gray-600",
  };
  return colors[status] || "bg-gray-100 text-gray-600";
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  return query.toString();
}
