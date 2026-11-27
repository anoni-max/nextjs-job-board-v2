"use client";

import { useEffect } from "react";

type Props = {
  jobId: string;
  title: string;
  category?: string | null;
  location?: string | null;
  employmentType?: string | null;
};

export default function TrackJobView({ jobId, title, category, location, employmentType }: Props) {
  useEffect(() => {
    const gtag = (window as any).gtag;
    if (typeof gtag === "function") {
      gtag("event", "job_view", {
        job_id: jobId,
        job_title: title,
        job_category: category || "",
        job_location: location || "",
        employment_type: employmentType || "",
      });
    }
  }, [jobId, title, category, location, employmentType]);

  return null;
}
