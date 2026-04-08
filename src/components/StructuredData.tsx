import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '@/config/site';

interface FAQItem {
  q: string;
  a: string;
}

export const WebSiteSchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      })}
    </script>
  </Helmet>
);

export const ServiceSchema = ({ name, description }: { name: string; description: string }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        provider: {
          '@type': 'Organization',
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
      })}
    </script>
  </Helmet>
);

export const FAQSchema = ({ items }: { items: FAQItem[] }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      })}
    </script>
  </Helmet>
);

export const ImageSchema = ({ url, description }: { url: string; description: string }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        url,
        description,
      })}
    </script>
  </Helmet>
);
