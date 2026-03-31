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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEOHead;
