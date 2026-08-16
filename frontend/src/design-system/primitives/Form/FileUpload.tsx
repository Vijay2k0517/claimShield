import React, { useState, useRef } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import './Form.css';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = 'image/jpeg,image/png,image/webp,application/pdf',
  maxFiles = 10,
  disabled = false,
  className = '',
  label = 'Upload Vehicle Damage Evidence',
  description = 'Drag and drop front, rear, or side collision photos, police reports, or estimates (JPEG, PNG, WebP up to 25MB)',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFiles = (rawFiles: FileList | null) => {
    if (!rawFiles || rawFiles.length === 0) return;
    const fileArray = Array.from(rawFiles).slice(0, maxFiles);
    
    const mapped: UploadedFile[] = fileArray.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      size: f.size,
      type: f.type,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }));

    setFiles((prev) => [...prev, ...mapped].slice(0, maxFiles));
    if (onFilesSelected) onFilesSelected(fileArray);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={className}>
      <div
        className={`cs-file-upload ${isDragOver ? 'cs-drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          disabled={disabled}
          style={{ display: 'none' }}
          onChange={(e) => processFiles(e.target.files)}
        />
        <div className="cs-file-upload-icon">
          <UploadCloud size={32} />
        </div>
        <div className="cs-file-upload-title">{label}</div>
        <div className="cs-file-upload-subtitle">{description}</div>
      </div>

      {files.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--cs-space-2)',
            marginTop: 'var(--cs-space-3)',
          }}
        >
          {files.map((file) => (
            <div
              key={file.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--cs-space-2)',
                padding: 'var(--cs-space-2)',
                backgroundColor: 'var(--cs-slate-850)',
                border: '1px solid var(--cs-border-default)',
                borderRadius: 'var(--cs-radius-md)',
              }}
            >
              {file.previewUrl ? (
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  style={{
                    width: 36,
                    height: 36,
                    objectFit: 'cover',
                    borderRadius: 'var(--cs-radius-sm)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--cs-radius-sm)',
                    backgroundColor: 'var(--cs-slate-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cs-slate-400)',
                  }}
                >
                  <File size={18} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 'var(--cs-text-size-caption)',
                    fontWeight: 'var(--cs-font-weight-medium)',
                    color: 'var(--cs-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {file.name}
                </div>
                <div
                  className="cs-tabular-nums"
                  style={{
                    fontSize: '10px',
                    color: 'var(--cs-slate-500)',
                  }}
                >
                  {formatSize(file.size)}
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => removeFile(file.id, e)}
                style={{
                  color: 'var(--cs-slate-400)',
                  padding: '2px',
                  borderRadius: 'var(--cs-radius-sm)',
                }}
                aria-label="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
