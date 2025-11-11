// Sponzoři page – renders Markdown from /content/pages/sponzori.md and a logo grid.
// This file reads Markdown for copy and displays a responsive grid of sponsor logos stored locally.

/**
 * Renders the Sponzoři static page from Markdown content and local logo images.
 */
import { readMarkdownPageBySlug } from "../../../lib/content/read-page";
import Image from "next/image";

export default async function SponzoriPage() {
  const { title, html, data } = await readMarkdownPageBySlug("sponzori");
  const parsedSponsors: Array<{ name: string; image: string; href?: string }> = (() => {
    const raw = (data?.sponsors as string | undefined) || "";
    try {
      const arr = typeof raw === "string" ? JSON.parse(raw) : Array.isArray(raw) ? raw : [];
      return (arr as Array<unknown>).map((sponsorItem) => {
        const obj = sponsorItem && typeof sponsorItem === "object" ? (sponsorItem as Record<string, unknown>) : {};
        const name = typeof obj.name === "string" ? obj.name : "";
        const image = typeof obj.image === "string" ? obj.image : "";
        const href = typeof obj.href === "string" && obj.href.trim().length > 0 ? obj.href : undefined;
        return { name, image, href };
      });
    } catch {
      return [];
    }
  })();
  const sponsors = parsedSponsors.length
    ? parsedSponsors.map((s) => ({
        name: s.name,
        src: `/images/sponsors/${s.image}`,
        href: s.href,
      }))
    : [
        { name: "Národní sportovní agentura", src: "/images/sponsors/Narodni-sportovni-agentura_logo-rgb-1024x513.png" },
        { name: "Liberecký kraj", src: "/images/sponsors/sponzor_liberecky-kraj_cerne.png" },
        { name: "Obec Skuhrov", src: "/images/sponsors/sponzor_skuhrov-911x1024.png" },
        { name: "Obec Pěnčín", src: "/images/sponsors/sponzor_obec-pencin.png" },
        { name: "Malina Safety", src: "/images/sponsors/MS_Logo_ColorTranspBG-1024x164.png" },
        { name: "TFnet", src: "/images/sponsors/sponzor_tfnet.png" },
        { name: "Sorbents", src: "/images/sponsors/sponzor_sorbents.png" },
        { name: "Večerník", src: "/images/sponsors/sponzor_vecernik.jpg" },
        { name: "Turbosport", src: "/images/sponsors/sponzor_turbosport.png" },
        { name: "Drda beads", src: "/images/sponsors/sponzor_drda-beads.jpg" },
      ];
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">{title}</h1>
      <section className="mt-2 mb-10">
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => {
            const showCaption = sponsor.name === "Obec Skuhrov" || sponsor.name === "Obec Pěnčín";
            const cardInner = (
              <>
                <div className="relative w-full aspect-[3/2]">
                  <Image
                    src={sponsor.src}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={false}
                  />
                </div>
                {showCaption ? (
                  <div className="mt-2 text-center text-sm font-medium">{sponsor.name}</div>
                ) : null}
              </>
            );
            return (
              <li key={sponsor.src} className="border rounded-md bg-white p-4">
                {("href" in sponsor && sponsor.href) ? (
                  <a href={sponsor.href} aria-label={sponsor.name} target="_blank" rel="noreferrer noopener" className="block">
                    {cardInner}
                  </a>
                ) : (
                  cardInner
                )}
              </li>
            );
          })}
          <li className="border rounded-md bg-white p-4">
            <div className="w-full aspect-[3/2] flex items-center justify-center text-center text-sm">
              <div>
                <div className="font-semibold">Rolbaři</div>
                <div>Josef Bouda a Pavel Pavlata</div>
              </div>
            </div>
          </li>
          <li className="border rounded-md bg-white p-4">
            <div className="w-full aspect-[3/2] flex items-center justify-center text-center text-sm">
              <div className="font-semibold">Salon OLLi</div>
            </div>
          </li>
        </ul>
      </section>
      <article
        className="space-y-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}


