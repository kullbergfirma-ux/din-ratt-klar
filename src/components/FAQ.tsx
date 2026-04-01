import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Vad kostar det?',
    a: 'Att se din rättighetsbedömning är helt gratis. Vill du se fullständig analys och kravbrev kostar det 39 kr (Bas) eller 99 kr (Komplett). Engångsbetalning per ärende — ingen prenumeration.',
  },
  {
    q: 'Hur säker är bedömningen?',
    a: 'Bedömningen baseras på gällande svensk och EU-lagstiftning och ger dig en god uppfattning om dina rättigheter. Vid komplexa ärenden rekommenderar vi att du kontaktar Konsumentverket eller en jurist.',
  },
  {
    q: 'Vad gör jag om motparten vägrar?',
    a: 'Om motparten inte svarar eller vägrar kan du anmäla ärendet till ARN (Allmänna reklamationsnämnden) som gör en kostnadsfri prövning. I sista hand kan du vända dig till Kronofogden.',
  },
  {
    q: 'Sparas min information?',
    a: 'Nej. All information stannar i din webbläsare och skickas direkt till AI-tjänsten för analys. Vi sparar ingenting på våra servrar.',
  },
];

const FAQ = () => (
  <div>
    <Accordion type="single" collapsible className="card-elevated divide-y divide-border">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-none">
          <AccordionTrigger className="px-5 py-4 text-sm font-medium text-foreground hover:no-underline">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default FAQ;
