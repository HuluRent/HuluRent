import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subjectId = searchParams.get('subjectId');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <span className="material-symbols-outlined text-5xl text-success mb-4 block">task_alt</span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Report Submitted</h1>
        <p className="font-body-md text-on-surface-variant mb-6">
          Thank you for reporting. Our team will review this shortly.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:shadow-hover transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Submit a Report</h1>
      <p className="font-body-md text-on-surface-variant mb-6">
        Help us keep HuluRent safe by reporting issues.
      </p>
      <ReportForm subjectId={subjectId} onSuccess={() => setSubmitted(true)} />
    </div>
  );
}

