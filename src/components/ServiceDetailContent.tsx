import Image from 'next/image';
import type { ServiceContent } from '@/data/serviceContent';

export default function ServiceDetailContent({ content }: { content: ServiceContent }) {
  return (
    <section className="bg-cloud py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {content.sectionsHeading && (
          <h2 className="text-2xl font-extrabold tracking-tight text-brand sm:text-3xl">
            {content.sectionsHeading}
          </h2>
        )}
        {content.intro && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
            {content.intro}
          </p>
        )}

        <div className="mt-8 space-y-5">
          {content.sections.map((sec) => (
            <div
              key={sec.title}
              className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5"
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-ink">{sec.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {sec.included.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-ink/80">
                        <svg className="h-4 w-4 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {item}
                      </li>
                    ))}
                    {sec.excluded.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-ink/50">
                        <svg className="h-4 w-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative h-32 w-full flex-shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-40">
                  <Image
                    src={sec.image}
                    alt={sec.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {content.note && (
          <div className="mt-6 flex items-start gap-2 rounded-xl bg-white px-4 py-3 text-sm text-ink/70 ring-1 ring-black/5">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            {content.note}
          </div>
        )}

        {content.extras?.map((ex) => (
          <div key={ex.heading} className="mt-8">
            <h3 className="text-xl font-bold text-brand">{ex.heading}</h3>
            <div className="mt-2 text-sm leading-relaxed text-ink/70">{ex.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
