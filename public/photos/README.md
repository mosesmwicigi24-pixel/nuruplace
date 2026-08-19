# Photographs

The site is built to hold photographs but ships without any. Nothing here is
stock and nothing is generated: these are pictures of real people in a real
church, and a visitor can usually tell the difference.

Until a file exists for a slot, that slot renders the colour-and-type treatment
instead. Nothing breaks, and nothing pretends.

## The shot list

Three photographs would change this site more than any other single change,
because they answer the question a stranger is actually asking — *is this
church for someone like me?*

| Slot | What to photograph | Why |
|---|---|---|
| `hero` | The congregation mid-worship, wide, faces visible | The homepage currently answers "what do you believe" but not "who is here" |
| `building` | The entrance or gate from the street | So a first-time visitor recognises the place when they arrive |
| `welcome` | People talking after a service — greeting, not posing | Shows what happens *around* the service, which is what most people are nervous about |

Photograph real moments rather than arranged line-ups. A slightly imperfect
picture of people genuinely glad to see each other beats a sharp one of people
standing still.

## Consent

Ask before publishing recognisable faces, and **never publish an identifiable
photograph of a child without a guardian's explicit permission.** Kenya's Data
Protection Act treats a photograph as personal data and children as protected
data subjects; a face on a public website is a disclosure that cannot be undone.
Keep a simple record of who agreed.

## Preparing the files

Data in Kenya costs several times what it does in Europe, so file size is a
kindness, not a technicality.

- Export at **1600px wide** for the hero, 1200px for the rest. Larger is wasted.
- Save as **JPEG at quality 75–80**, or WebP if your tool offers it. Next.js
  converts and resizes automatically from there.
- Aim under **250 KB** per file. If a photo is over 500 KB, re-export it.
- Name files for what they show: `hero-sunday-worship.jpg`, not `IMG_4821.jpg`.

## Wiring one up

Drop the file in this folder, then set `src` (and ideally `width`/`height`) in
`src/content/photos.ts`:

```ts
hero: {
  src: "/photos/hero-sunday-worship.jpg",
  width: 1600,
  height: 900,
  alt: {
    en: "The congregation at The Good News Mission during a Sunday service",
    sw: "Kusanyiko la The Good News Mission wakati wa ibada ya Jumapili",
  },
},
```

Write alt text that describes what is happening. A screen-reader user should
get the same sense of the room that a sighted visitor does — "church photo"
gives them nothing.
