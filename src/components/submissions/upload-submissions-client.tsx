"use client";

import { useState } from "react";
import { UploadZone } from "./upload-zone";
import { SubmissionList } from "./submission-list";

interface UploadSubmissionsClientProps {
  examId: string;
}

export function UploadSubmissionsClient({ examId }: UploadSubmissionsClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <UploadZone examId={examId} onUploadComplete={handleUploadComplete} />
      <div className="mt-6">
        <SubmissionList key={refreshKey} examId={examId} />
      </div>
    </>
  );
}
