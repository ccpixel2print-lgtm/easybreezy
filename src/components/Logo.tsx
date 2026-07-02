import Image from 'next/image';

interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
}

export default function Logo({
  size = 44,
  showText = true,
  variant = 'dark',
  className = '',
}: LogoProps) {
  return (
    <a
      href="#home"
      aria-label="Easy Breezy Service Provider - Home"
      className={`flex items-center gap-2.5 ${className}`}
    >
      <span
        className="relative flex-shrink-0 overflow-hidden rounded-full ring-2 ring-brand shadow-sm"
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/eb-logo.webp"
          alt="Easy Breezy EB monogram logo"
          fill
          sizes="48px"
          className="object-cover"
          priority
        />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-[15px] font-extrabold tracking-tight sm:text-base ${
              variant === 'light' ? 'text-white' : 'text-brand'
            }`}
          >
            EASY BREEZY
          </span>
          <span
            className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${
              variant === 'light' ? 'text-accent' : 'text-brand-light'
            }`}
          >
            Service Provider
          </span>
        </span>
      )}
    </a>
  );
}
