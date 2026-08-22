import { ReportForm } from './ReportForm';

export function ReportModal({ isOpen, onClose, subjectId, subjectName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Report {subjectName || 'User'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">
          <ReportForm
            subjectId={subjectId}
            onSuccess={() => {
              alert('Report submitted successfully.');
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
