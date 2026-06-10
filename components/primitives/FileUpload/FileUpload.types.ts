/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** File upload zone with drag-and-drop. States: idle, hover/dragover, uploading, done, error. Sizes sm/md/lg. */

export type FileUploadSize = 'sm' | 'md' | 'lg';

export type FileUploadState = 'idle' | 'dragover' | 'uploading' | 'done' | 'error';

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: FileUploadSize;
  state?: FileUploadState;
}