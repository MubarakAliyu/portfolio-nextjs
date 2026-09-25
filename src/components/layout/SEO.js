// SEO: per-page <head> tags. Titles follow the "%s · Aliyu Mubarak" template.
import Head from "next/head";
import { useRouter } from "next/router";
import { site } from "@/data/site";

export default function SEO({ title, description = site.description, image = "/og.png" }) {
  const { asPath } = useRouter();
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} · ${site.role}`;
  const url = `${site.url}${asPath.split(/[?#]/)[0]}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${site.url}${image}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
