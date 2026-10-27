# Hero Portrait: AI Edit Prompt

How to turn one of Mason's own photos into a hero portrait that matches the current placeholder's look. **Status (2026-10-26):** the hero is `public/images/home/mason-hero.jpg`, Ashley's GPT Image edit of Mason's photo, mirrored without AI so he faces the headline. Mason still has to OK it (C15).

_Last updated: 2026-10-26_

## The look

The placeholder isn't a vignette (that only darkens a photo's edges). It's **low-key lighting**, also called **chiaroscuro**:

- **One hard key light** from the front-left and slightly above lights the forehead, cheekbone, nose and lips.
- **The shadow side** of the face, neck and shoulders falls off into pure black.
- **The background is solid black**, so the lit face is the only thing you see.
- **Black and white**, three-quarter profile, looking up and to the left.

The composition matters for the layout, not just the mood. `components/sections/home/HeroSection.tsx` places the image in the right two-thirds on desktop (`md:left-1/3`), crops toward `object-[60%_20%]`, and fades it into `neutral-950` from the left. On mobile it fades from the bottom, behind the headline. So the subject sits on the **right**, faces **left**, and keeps his face in the **upper half**, while the left side and bottom stay empty and black.

## Source photo

- **First choice: `modeling-08`** (a close side profile facing left). It's the closest of Mason's photos to the target pose, and the smaller the change, the less an AI edit drifts from his real face.
- **Backup: `modeling-23`** (cowboy hat, already shot at night against a dark background).
- **Upload the original from the shared Drive folder** (Modeling), not the 2000 px copy in `public/`, so the model has the full resolution to work with.

## Before you start

Ask Mason first (C15 in [open-questions.md](open-questions.md)). Two things need his OK:

1. Uploading his photo to a third-party AI service.
2. Using an AI-edited portrait of him as the site's main image. D-24 promises a site that shows the real Mason.

## Which model

**GPT Image 2** (in ChatGPT). Arena's crowd-voted image-edit leaderboard reportedly ranks it #1 in all seven categories, with Meta's Muse Image and Microsoft's MAI-Image-2.5 close behind for single-image edits ([Alphasignal](https://alphasignal.ai/news/lm-arena-breaks-down-52-image-models-across-7-categories-with-28m-votes)). ⚠ That article has no date, and rankings change often, so check the live image-edit leaderboard on [arena.ai](https://arena.ai/blog/march-2026-arena-updates/) before you choose.

Ashley used GPT Image for the first edit (`Smiling in the Shadows.png`, 1086 × 1448) and switched to **Nano Banana** (Google Gemini) for follow-ups when the free GPT quota ran out (2026-10-26).

## The prompt

Attach the photo and paste:

```text
Edit this photo of a real person into a dramatic black-and-white low-key studio portrait.

IDENTITY — keep exactly the same: his face, facial features, proportions, skin texture,
moustache, hairstyle and hair color tones, ear piercing, head angle and expression.
Do not beautify, slim, smooth, or change his age. This must still clearly be him.

LIGHTING (chiaroscuro):
- One hard key light from the front-left and slightly above, lighting the forehead,
  cheekbone, bridge of the nose, lips and jawline.
- The far side of the face, neck and shoulders fall off gradually into deep shadow.
- No fill light, no rim light, no colored light.

BACKGROUND: replace the wall with seamless, pure black. No texture, gradient or objects.
Let his shirt and shoulders fade into the black so the lit face is the only clear subject.

COMPOSITION: vertical 3:4 portrait. Keep him on the right side of the frame, facing left,
with his face in the upper half. Leave the left third and the bottom of the frame as
empty black space (text will be placed there).

STYLE: monochrome, rich blacks, high contrast but with natural skin detail and a subtle
fine film grain. Photographic and realistic — not illustrated, not CGI, no plastic skin.

Do not add text, logos, watermarks, borders or extra people.
Output at least 1600 × 2133 pixels.
```

**If the face drifts:** reply in the same chat with *"Keep his face exactly as in my original photo; only change lighting, background and color."* Compare the result side by side with the original. If it no longer clearly looks like Mason, don't use it.

## Variant: turn his gaze to the left (Nano Banana)

The first edit put him on the right, looking up and to the **right**, away from the headline. In a layout, a face looking *into* the page pulls the eye toward the text, so he should look left. Attach the edited image and paste:

```text
Edit this photo. Change only the direction he is facing: turn his head and eyes so he
looks up and toward the LEFT side of the frame (his right), the opposite of now.

Keep everything else exactly the same:
- Same person: identical face, features, smile, moustache, freckles, curly hair, and the
  earring in the same ear. Do not beautify, smooth, or change his age.
- Same position: his head stays in the upper-right part of the frame, the same size.
  Do not move or mirror him.
- Same lighting: black-and-white, one hard light, pure black background, his shirt and
  shoulders fading into black.
- Same framing: vertical 3:4, with the left side and bottom left empty and black.

No text, logos, borders or extra people. Output as large as possible, ideally at least
1600 × 2133 pixels.
```

**If his face changes:** reply *"Keep his face exactly as in the image I sent; only turn his head."* Turning a head means the model has to redraw the face, which drifts more than a lighting change does. Compare the result side by side with the original.

**Free alternative without AI:** the background is pure black, so the image can be mirrored and shifted back to the right with no visible seam (sharp: `flop()`, then pad the left with black). His face stays exactly the same pixels, but mirrored: the earring moves to the other ear and any facial asymmetry flips. A preview was made on 2026-10-26.

**Either way, resolution:** at 1086 px wide the hero will look soft on high-density (2×) screens, where it renders about 1900 px wide. Ask for a larger output, or start the next edit from the full-size original.

## Fallback: edit by hand (no AI)

His face can't change this way. In Lightroom or Photoshop:

1. Convert to black and white.
2. **Select Subject**, invert the selection, and pull the background down to black.
3. Add a radial darkening centered on the face, so the shoulders and edges fall into shadow.
4. Crop to 3:4 with the face in the upper right.

## Swapping it in

1. Run the file through the same optimization as the gallery: rotate, fit to 2000 px, JPEG q80, metadata stripped (`scripts/optimize-photo.ts`). Save it under a **new file name**: Next.js's image optimizer and browsers cache images by URL, so reusing the old name can keep showing the old photo.
2. In `content/home.ts`, point `homeImages.hero.src` at the new file and update the alt text. Delete the old file.
3. Check the crop on desktop and mobile with `npm run dev`. The face should stay clear of the headline.
4. Tick F5 in [open-questions.md](open-questions.md) and the hero row in [content-checklist.md](content-checklist.md).
