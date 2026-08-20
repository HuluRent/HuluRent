import { useRef } from 'react';

export function PhotoUploader({ files = [], onChange }) {
  const inputRef = useRef(null);
  const MAX_PHOTOS = 5;

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const combined = [...files, ...newFiles].slice(0, MAX_PHOTOS);
    onChange(combined);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {files.map((file, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant">
            <img
              src={URL.createObjectURL(file)}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeFile(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-xs leading-none"
              aria-label={`Remove photo ${i + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {files.length < MAX_PHOTOS && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 border-2 border-dashed border-outline-variant rounded-xl font-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-base align-middle mr-1">add_a_photo</span>
          Add Photos ({files.length}/{MAX_PHOTOS})
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default PhotoUploader;
