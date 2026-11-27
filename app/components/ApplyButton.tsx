"use client";

import { ExternalLink, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Props = {
  href: string;
  label: string;
  jobId: string;
  title: string;
  method: "url" | "email" | "search";
  external?: boolean;
  className?: string;
};

export default function ApplyButton({
  href,
  label,
  jobId,
  title,
  method,
  external = true,
  className,
}: Props) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() =>
        trackEvent("apply_click", {
          job_id: jobId,
          job_title: title,
          application_method: method,
        })
      }
      className={
        className ??
        "bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center gap-1"
      }
    >
      {method === "email" ? <Mail className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
      {label}
    </a>
  );
}
