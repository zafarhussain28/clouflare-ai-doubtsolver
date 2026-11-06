import { useEffect, useRef, useState } from 'react';
import { FileImage, ImagePlus, RotateCcw, Trash2, Upload } from 'lucide-react';

const ACCEPTED_TYPES = 'image/png,image/jpeg,image/webp';

function formatFileSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function ImageUploader({ file, onFileSelect, error, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const selectFile = (nextFile) => {
    onFileSelect(nextFile);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) selectFile(event.dataTransfer.files?.[0]);
  };

  return (
    <section className={`upload-card rounded-lg ${dragging ? 'is-dragging' : ''}`} aria-label="Question image upload">
      <div className="upload-card-heading">
        <div>
          <span className="eyebrow">Your question</span>
          <h2>Drop it in.</h2>
        </div>
        <span className="upload-step">01 <span>/ 02</span></span>
      </div>
      {file ? (
        <div className="selected-file">
          <div className="preview-frame">
            <img src={previewUrl} alt="Preview of selected question" />
          </div>
          <div className="file-details">
            <span className="file-icon"><FileImage size={18} aria-hidden="true" /></span>
            <div className="file-copy">
              <strong title={file.name}>{file.name}</strong>
              <span>{formatFileSize(file.size)} · Ready to analyze</span>
            </div>
            <div className="file-actions">
              <label className="icon-button file-action" title="Replace image" aria-label="Replace image">
                <RotateCcw size={16} aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED_TYPES}
                  onChange={(event) => selectFile(event.target.files?.[0])}
                  disabled={disabled}
                />
              </label>
              <button className="icon-button file-action" type="button" title="Remove image" aria-label="Remove image" onClick={() => selectFile(null)} disabled={disabled}>
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="drop-zone"
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
          }}
          onDrop={handleDrop}
        >
          <span className="drop-icon"><ImagePlus size={23} strokeWidth={1.8} aria-hidden="true" /></span>
          <p className="drop-title">Drag your question here</p>
          <p className="drop-subtitle">or browse from your device</p>
          <label className="browse-button">
            <Upload size={15} aria-hidden="true" /> Browse files
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={(event) => selectFile(event.target.files?.[0])}
              disabled={disabled}
            />
          </label>
          <span className="file-hint">PNG, JPG, JPEG, WEBP <i /> Up to 5 MB</span>
        </div>
      )}
      {error && <p className="upload-error" role="alert">{error}</p>}
    </section>
  );
}

export default ImageUploader;