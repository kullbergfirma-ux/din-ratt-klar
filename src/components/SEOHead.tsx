import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '@/config/site';

interface Props {
  title: string;
  description: string;
  canonical?: string;
}

const SEOHead = ({ title, description, canonical }: Props) => {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const canonicalUrl = canonical ? `${SITE_CONFIG.url}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl || SITE_CONFIG.url} />
      {/* TODO: Add real og-image.png to /public — recommended size 1200x630px */}
      <meta property="og:image" content={`${SITE_CONFIG.url}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_CONFIG.name} — Kräv din rätt och få ersättning du har rätt till`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_CONFIG.url}/og-image.png`} />
    </Helmet>
  );
};

export default SEOHead;
