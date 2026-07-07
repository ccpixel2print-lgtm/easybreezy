interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

/**
 * Solid light-grey rounded placeholder block used in place of real images.
 * (Real images will be added later.)
 */
export default function ImagePlaceholder({
  label = 'Service Image',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 ${className}`}
    >
      <span className="flex flex-col items-center gap-1 px-2 text-center">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75h.008v.008H18V3.75zm-15 4.5V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V8.25z" />
        </svg>
        <span className="text-[11px] font-medium leading-tight">{label}</span>
      </span>
    </div>
  );
}
