const WHATSAPP_URL =
  'https://wa.me/919014434640?text=Hi Easy Breezy%2C I would like to know more about your services.';

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-[60] flex items-center sm:bottom-6 sm:right-6"
    >
      {/* Tooltip */}
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 sm:block">
        Chat with us on WhatsApp
        <span className="absolute right-[-5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-ink" />
      </span>

      {/* Button */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
        {/* Pulse rings */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
        <span className="absolute inset-0 rounded-full bg-[#25D366]" />
        {/* WhatsApp logo */}
        <svg
          className="relative h-8 w-8 text-white"
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.592 4.464 1.716 6.41L3.2 28.8l6.57-1.72a12.74 12.74 0 006.234 1.588h.005c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.668-12.805-12.668zm0 23.06h-.004a10.6 10.6 0 01-5.4-1.48l-.388-.23-4.02 1.052 1.073-3.918-.253-.402a10.56 10.56 0 01-1.62-5.632c0-5.87 4.777-10.646 10.652-10.646 2.844 0 5.518 1.108 7.53 3.12a10.58 10.58 0 013.118 7.532c0 5.872-4.777 10.648-10.652 10.648zm5.84-7.976c-.32-.16-1.894-.934-2.188-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.352-.498-2.576-1.588-.952-.85-1.594-1.9-1.78-2.22-.187-.32-.02-.492.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.736-.987-2.376-.26-.624-.524-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.67 0 1.574 1.147 3.096 1.307 3.31.16.213 2.256 3.446 5.466 4.832.764.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.894-.774 2.16-1.522.267-.747.267-1.387.187-1.522-.08-.133-.293-.213-.613-.373z" />
        </svg>
      </span>
    </a>
  );
}
