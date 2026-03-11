# Bid for bid

> Mad, der virker. Hver dag.

Personligt opskriftsarkiv og AI-notesbog. Bygget med Next.js 14, TypeScript og MDX.

---

## Kom i gang

### Forudsætninger

- Node.js 18+ og npm
- Git

### Install og kør lokalt

```bash
# Klon projektet
git clone https://github.com/dit-brugernavn/bid-for-bid.git
cd bid-for-bid

# Installér dependencies (genererer også søgeindeks)
npm install

# Start udviklingsserver
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000) i browseren.

---

## Tilføj en ny opskrift

### 1. Opret en MDX-fil

Opret en ny fil i `content/opskrifter/` med et beskrivende navn:

```
content/opskrifter/min-nye-opskrift.mdx
```

Filnavnet bliver opskriftens URL: `/opskrifter/min-nye-opskrift`

### 2. Udfyld frontmatter

Kopiér denne skabelon og udfyld felterne:

```yaml
---
title: Opskriftens navn
description: Kort beskrivelse der vises på kortene og i søgning. 1-2 sætninger.
tags:
  - hurtig-hverdagsmad        # kategori-slug (se liste nedenfor)
  - bornevenligt
cuisine: dansk                # valgfrit: dansk, italiensk, indisk, japansk-inspireret osv.
mealType: aftensmad           # aftensmad | frokost | morgenmad | snack | dessert
timeTotal: 30                 # minutter i alt
timePrep: 10                  # valgfrit
timeCook: 20                  # valgfrit
servingsDefault: 2 voksne + 2 børn
servingsCount: 4              # bruges til skalering
kidFriendly: true             # true | false
leftoverFriendly: false       # true | false
dietary:
  - vegetar                   # vegetar | vegansk | glutenfri | mælkefri | fisk
season:
  - hele året                 # forår | sommer | efterår | vinter | hele året
publishedAt: "2024-12-01"     # valgfrit, ISO dato
image: /images/min-ret.jpg    # valgfrit – placer billedet i /public/images/
equipment:                    # valgfrit
  - Stor pande
ingredients:
  - amount: "400"
    unit: g
    item: pasta
    note: fx rigatoni          # valgfrit
    group: Kolonial            # Grønt | Mejeri | Kød & Fisk | Kolonial | Krydderier | Andet
  - amount: "2"
    unit: fed
    item: hvidløg
    group: Grønt
steps:
  - Første trin. Vær konkret og handlingsorienteret.
  - Andet trin.
  - Tredje trin.
tips:                         # valgfrit
  - Et godt råd.
variations:                   # valgfrit
  - En variation på retten.
source: Inspireret af X       # valgfrit
---

Valgfri brødtekst under frontmatteren. Kan bruges til historien bag retten,
ekstra noter eller andet der ikke passer i de strukturerede felter.
```

### Kategorier (tag-slugs)

| Tag | Beskrivelse |
|-----|-------------|
| `hurtig-hverdagsmad` | 20–30 min fra køleskab til bord |
| `bornevenligt` | Retter børn faktisk spiser |
| `fisk-skaldyr` | Fra hav til bord |
| `vegetar` | Grønt der mætter |
| `italien` | Pasta, polenta og klassikere |
| `one-pot-ovn` | Et fad, færre opvaskede gryder |
| `rester-madpakke` | Spis op, smid mindre ud |
| `fermentering-sylt` | Det gode der tager tid |

### 3. Opdatér søgeindekset

Søgeindekset opdateres automatisk ved `npm run build`. Under udvikling:

```bash
node scripts/generate-search-index.js
```

---

## Tilføj en AI-guide

Opret en fil i `content/ai-guides/`:

```yaml
---
title: Guidens navn
description: Kort beskrivelse.
category: madplan              # madplan | indkob | rester | fermentering | bornevenlig-mad | projektstyring
tags:
  - madplan
problem: Hvad er problemet der løses?
solution: Hvad er løsningen i én sætning?
workflow:
  - Trin 1.
  - Trin 2.
prompts:
  - label: Prompt-navn
    text: |
      Selve prompten. Kan være flere linjer.
      Brug [BRACKETS] som pladsholdere.
example:
  input: Hvad brugeren skriver ind.
  output: Hvad AI svarer.
---
```

---

## Skift navn eller tagline

Åbn `site.config.ts` og rediger øverst:

```ts
name: "Bid for bid",
tagline: "Mad, der virker. Hver dag.",
```

Ændringen slår igennem overalt på sitet – header, footer, metadata og hero.

---

## Tilføj billeder

Placer billedfiler i `/public/images/` og referer til dem i frontmatter:

```yaml
image: /images/min-opskrift.jpg
```

Anbefalede mål: **1200×800 px**, JPEG eller WebP, max 200 KB.
Next.js håndterer lazy loading og responsive størrelse automatisk.

---

## Deploy til Vercel

### Første gang

1. Push koden til GitHub
2. Gå til [vercel.com](https://vercel.com) og opret et projekt fra din repo
3. Vercel registrerer automatisk at det er Next.js
4. Klik "Deploy" – klar på 2 minutter

### Efterfølgende deploys

```bash
git add .
git commit -m "Tilføj opskrift: min-ret"
git push
```

Vercel deployer automatisk ved hvert push til `main`.

### Environment variables

Ingen er nødvendige i v1. Sitet kører uden ekstern konfiguration.

### Custom domæne

I Vercel dashboard: Settings → Domains → tilføj dit domæne.

---

## Projektstruktur

```
bid-for-bid/
├── content/
│   ├── opskrifter/        # MDX-opskrifter (én fil = én opskrift)
│   └── ai-guides/         # MDX AI-guides
├── public/
│   ├── images/            # Opskriftsbilleder
│   └── search-index.json  # Auto-genereret søgeindeks
├── scripts/
│   └── generate-search-index.js   # Køres ved build
├── src/
│   ├── app/               # Next.js App Router sider
│   │   ├── page.tsx                    # Forside
│   │   ├── opskrifter/
│   │   │   ├── page.tsx                # Opskriftsliste
│   │   │   └── [slug]/page.tsx         # Opskrift-detalje
│   │   ├── ai-i-hverdagen/
│   │   │   ├── page.tsx                # Guide-liste
│   │   │   └── [slug]/page.tsx         # Guide-detalje
│   │   ├── ugeplan/page.tsx            # Ugeplangenerator
│   │   └── om/page.tsx                 # Om-side
│   ├── components/
│   │   ├── layout/        # Header, Footer
│   │   ├── recipes/       # RecipeCard, Filter, Scaler, IngredientSearch osv.
│   │   ├── ai/            # GuideCard, PromptBlock
│   │   ├── home/          # Hero, WhatForDinner, WeeklyPlan
│   │   └── shopping/      # ShoppingListModal
│   ├── lib/               # recipes.ts, guides.ts, utils.ts
│   └── types/             # TypeScript-typer
├── site.config.ts         # Navn, tagline, kategorier – ret her
├── tailwind.config.ts     # Farvepalette og typografi
└── next.config.ts
```

---

## v2-forbedringer

Her er det der giver mest mening at tilføje når v1 sidder:

**Indhold og brugeroplevelse**
- Favoritopskrifter (localStorage, ingen login)
- Bedømmelse af opskrifter (1-5 stjerner, lokalt)
- Print-CSS polering med logo og URL
- Opskrift-noter ("næste gang: tilsæt mere citron")

**Billeder**
- Billedupload-workflow med automatisk komprimering
- Blur-placeholder generering ved build
- Cloudinary eller Vercel Blob til billeder

**Søgning og navigation**
- Fuldt fungerende klientside-søgning med Fuse.js
- Relaterede opskrifter på detaljeside
- "Senest set" (localStorage)

**AI-integration**
- Direkte OpenAI/Claude API-kald til ingredient-match
- Automatisk madplan fra egne opskrifter via AI
- "Hvad kan jeg lave?" med fri tekstinput

**CMS og workflow**
- Tina CMS eller Contentlayer til redigering uden kode
- Billeder direkte i MDX med `<RecipeImage>` komponent
- Import fra Paprika, Cookpad eller andre apps

**Bruger og deling**
- NextAuth login (Google/email)
- Del opskrift som link eller PDF
- Eksportér ugeplan som iCal
- Familiedeling af indkøbsliste (Supabase realtime)
