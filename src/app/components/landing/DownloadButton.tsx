import { Download } from 'lucide-react';
import { APP_DOWNLOAD_URL } from '../../config';

type DownloadButtonProps = {
  label: string;
  className?: string;
  size?: 'default' | 'large';
};

export function DownloadButton({ label, className = '', size = 'default' }: DownloadButtonProps) {
  const sizeClasses =
    size === 'large'
      ? 'px-8 py-4 text-lg gap-3'
      : 'px-6 py-3 text-base gap-2';

  return (
    <a
      href={APP_DOWNLOAD_URL}
      download
      className={`inline-flex items-center justify-center rounded-xl bg-white font-semibold text-brand shadow-lg transition hover:bg-brand-muted ${sizeClasses} ${className}`}
    >
      <Download className={size === 'large' ? 'h-6 w-6' : 'h-5 w-5'} aria-hidden />
      {label}
    </a>
  );
}
