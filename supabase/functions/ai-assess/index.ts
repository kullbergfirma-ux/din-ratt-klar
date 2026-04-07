import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, categoryTitle, answersText, assessment, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (type === "assessment") {
      const today = new Date().toLocaleDateString("sv-SE");
      const systemPrompt = `Du är en senior svensk konsumentjurist med 20 års erfarenhet. Dagens datum är ${today}.

ABSOLUTA REGLER — BRYTS ALDRIG:

REGEL 1 — KONTROLLERA PRESKRIPTION ALLRA FÖRST:
Beräkna exakt hur lång tid som gått sedan relevant datum. Om preskriptionstiden löpt ut: ge ALLTID negativt utfall.
- Konsumentköplagen reklamation: 3 år från köpdatum (32 §)
- EU 261/2004 flyg: 3 år från flygdatum
- Betaltjänstlagen chargeback: 13 månader från transaktionsdatum
- Konsumenttjänstlagen hantverkare: 3 år från avslutat uppdrag
- Paketreselagen: 2 månader från hemkomst
Visa alltid beräkningen: "Köpet gjordes [datum], det är [X år Y månader] sedan. Preskriptionstiden är [Z år]. Denna situation [faller inom / faller utanför] preskriptionstiden."

REGEL 2 — BEDÖM BARA FAKTISKA PROBLEM:
Ge ALDRIG positivt utfall om:
- Användaren säger att allt fungerar bra
- Inget konkret problem beskrivs
- Belopp är 0 eller saknas vid betalningstvister
- Situationen är självmotsägande

REGEL 3 — TRE UTFALL, VÄLJ RÄTT:
- POSITIVT: Konkret problem + rätt lag tillämplig + inom preskriptionstid + tillräcklig beskrivning
- OSÄKERT: Vag beskrivning, saknad nyckelinformation, eller genuint oklart rättsläge
- NEGATIVT: Preskriberat, inget problem, utanför lagens tillämpningsområde, eller uppenbart ogrundat

REGEL 4 — JURIDISK PRECISION:
- Konsumentköplagen: KÖP av varor från NÄRINGSIDKARE
- Köplagen: köp från PRIVATPERSON (sämre skydd)
- EU 261/2004: OPERATIVT flygbolag, inte researrangör
- Betaltjänstlagen: OBEHÖRIGA transaktioner — inte missnöjda köp
- Konsumenttjänstlagen: UTFÖRDA tjänster med fel
- Bevisbörda: inom 2 år → säljaren bevisar; 2–3 år → konsumenten bevisar

REGEL 5 — NORMALT SLITAGE ÄR ALDRIG REKLAMATIONSGRUND:
Om felet sannolikt beror på normalt slitage, felaktig användning eller yttre åverkan: ge negativt eller osäkert utfall.

REGEL 6 — VALUTAREGEL — TILLÄMPAS ALLTID:
Denna tjänst riktar sig till svenska konsumenter. Presentera ALLTID ersättningsbelopp primärt i SEK.
När EU-lag anger belopp i EUR, gör följande:
1. Referera det juridiska beloppet i EUR för korrekthet: "EU-förordning 261/2004 anger 400€"
2. Konvertera omedelbart och visa SEK-motsvarigheten som primärt belopp: "vilket motsvarar ungefär 4 400 kr"
3. Använd en ungefärlig fast växelkurs: 1 EUR = 11 SEK
4. Led ALLTID med SEK i bedömningen — EUR är sekundärt och visas bara som juridisk referens
Exempel:
- "Du har rätt till ersättning om ungefär 4 400 kr (400€ enligt EU-förordning 261/2004)"
- "Ersättningen uppgår till cirka 2 750 kr (250€)"
- "Vid längre sträckor kan du ha rätt till upp till 6 600 kr (600€)"
Visa ALDRIG enbart EUR. Led ALDRIG med EUR. SEK ska alltid vara det primära beloppet.

SVARSFORMAT — svara ALLTID med exakt detta JSON och inget annat:
{
  "sentiment": "positive",
  "assessment": "## Bedömning\\n\\n..."
}

ASSESSMENT-STRUKTUR — inkludera ENBART dessa sektioner:
## Bedömning
[1-2 meningar med tydligt utfall]

### Juridisk grund
[Exakt lag och paragraf, naturligt invävet. Använd markdown-länk: [Konsumentköplagen (2022:260)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/konsumentkoplag-2022260_sfs-2022-260/)]

### Uppskattad ersättning
[Belopp om möjligt, annars "Kan inte beräknas exakt utan mer information"]

### Svagheter i ditt ärende
[Vad motparten troligtvis invänder]

Inkludera ALDRIG "## Nästa steg" i bedömningen. Nästa steg tillhandahålls enbart i komplett-paketet.

*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`;

      const userPrompt = `Kategori: ${categoryTitle}\n\nAnvändarens svar:\n${answersText}\n\nAnalysera strikt och juridiskt korrekt. Kontrollera datum och preskription noggrant. Returnera ENDAST JSON.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) {
          return new Response(JSON.stringify({ error: "För många förfrågningar. Försök igen om en stund." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (status === 402) {
          return new Response(JSON.stringify({ error: "AI-krediter slut. Kontakta administratören." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await response.text();
        console.error("AI gateway error:", status, t);
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();

      try {
        const parsed = JSON.parse(clean);
        return new Response(JSON.stringify({
          assessment: parsed.assessment || "",
          sentiment: parsed.sentiment || "uncertain",
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch {
        return new Response(JSON.stringify({
          sentiment: "uncertain",
          assessment: "## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nVi kunde inte genomföra en fullständig analys just nu. Försök igen eller kontakta [Konsumentverket](https://www.konsumentverket.se) för kostnadsfri vägledning.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning.*",
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    if (type === "letter") {
      const today = new Date();
      const todayStr = today.toLocaleDateString("sv-SE");
      const deadline = new Date(today);
      deadline.setDate(deadline.getDate() + 14);
      const deadlineStr = deadline.toLocaleDateString("sv-SE");

      const name = profile?.fullName || "[DITT NAMN]";
      const email = profile?.email || "[DIN E-POST]";
      const phone = profile?.phone || "";
      const counterparty = profile?.counterparty || "[MOTPARTENS FÖRETAGSNAMN]";
      const contactLine = [email, phone].filter(Boolean).join(" | ");

      const systemPrompt = `Du är en erfaren svensk jurist som skriver reklamationsmejl och kravbrev för konsumenter.

REGLER:
- FORMAT: E-postmeddelande, inte formellt brev. Börja direkt med "Till: [motpart]" och "Ämne: [ämne]"
- TOM: Professionell men mänsklig. Konstruktiv och lösningsorienterad, inte aggressiv
- INLEDNING: Börja med "Hej," följt av en naturlig mening om varför du skriver. ALDRIG med frågor och svar från formuläret
- SYNTETISERA: Omvandla svaren till flytande sammanhängande prosa. Inga listor av Q&A
- LAG: Hänvisa naturligt till relevant lag och paragraf i löptexten — inte som rubrik eller fotnot
- AVHJÄLPANDE: För reklamation — prioritera: reparation → byte → prisavdrag → återbetalning
- TIDSFRIST: Ange "senast den ${deadlineStr}" — presentera som rimlig förväntning, inte ultimatum
- ESKALERING: En sista mening om att ärendet annars anmäls till [relevant instans]
- INGA HAKPARENTESER i slutresultatet om informationen finns tillgänglig
- INGA RUBRIKER eller sektionsetiketter i brevtexten
- MAX 250 ord i brevtexten

AVSLUTA alltid med:
Med vänliga hälsningar,
${name}
${contactLine}`;

      const userPrompt = `Kategori: ${categoryTitle}
Avsändare: ${name} | ${email}${phone ? ` | ${phone}` : ""}
Motpart: ${counterparty}
Datum: ${todayStr}

Användarens svar på frågorna:
${answersText}

Juridisk analys som stöd:
${assessment}

Skriv ett professionellt reklamationsmejl. Syntetisera svaren till naturlig prosa. Inga frågor och svar.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) {
          return new Response(JSON.stringify({ error: "För många förfrågningar. Försök igen om en stund." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (status === 402) {
          return new Response(JSON.stringify({ error: "AI-krediter slut. Kontakta administratören." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const letterText = data.choices?.[0]?.message?.content || `Till: ${counterparty}\nÄmne: Reklamation\n\nKunde inte generera brev. Försök igen.`;

      return new Response(JSON.stringify({ letter: letterText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-assess error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
