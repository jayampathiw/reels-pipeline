# Video Styles & Strategy

> Strategic reference for the four reel styles we produce. Captures trade-offs, when to use each, what to watch for in production, and how the style mix should evolve as engagement data appears.

## Why this document exists

Different formats build different audiences. A page that mixes styles randomly trains the algorithm against itself and never grows a coherent follower base. Picking the right style for a clip set is the single biggest content decision per reel, and the choice has to be made systematically — not by gut feel — once we're producing dozens of reels a week.

This doc is the source of truth for that decision. It should be read by anyone (human or Claude) before generating, reviewing, or approving a reel.

## The four styles at a glance

|                              | **1. Factual** (Hook + 3 facts + CTA)         | **2. Cinematic** (Evocative)                       | **3. Listicle** (Countdown)                  | **4. Silent** (Natural footage)                              |
|------------------------------|-----------------------------------------------|----------------------------------------------------|----------------------------------------------|--------------------------------------------------------------|
| **Channel key**              | `wildlife/factual/EN`                         | `wildlife/cinematic/EN`                            | `wildlife/listicle/EN`                       | `wildlife/silent/EN`                                         |
| **FB Page**                  | Wildlife Daily                                | Wild Cinema                                        | Wildlife Daily                               | Wild Cinema                                                  |
| **Tone**                     | Informative, snappy                           | Poetic, slow, atmospheric                          | Playful, quiz-like                           | Ambient, observational, contemplative                        |
| **Density**                  | 3 standalone facts                            | Mostly mood, 0-1 facts                             | 5 quick facts, no depth                      | No narration — pure visual                                   |
| **Pacing**                   | Steady, predictable beats                     | Slow, breathing room                               | Rapid, no pauses                             | Natural clip rhythm, no spoken beats                         |
| **Hook style**               | One striking fact                             | A sensory image / scene                            | "5 things about X"                           | A striking visual moment in the first 2s                     |
| **What viewers remember**    | A specific fact or two                        | A feeling / vibe                                   | The number + maybe one item                  | Atmosphere; the animal itself                                |
| **Watch-through risk**       | Low — each fact rewards staying               | Medium — needs a real hook or they bounce          | Low first 2 items, drop-off after            | High variance — strong clips hold, weak ones lose fast       |
| **Brand it builds**          | "Trusted wildlife page" — educational, respected | "Premium nature docs" — emotional, shareable    | "Snackable wildlife trivia" — viral but disposable | "Calming nature window" — relaxation, escape               |
| **FB Reels algorithm fit**   | Solid mid-tier reach                          | Highest share rate when good, flops if mid         | Highest initial click rate, lower retention  | Strong on shares + saves, weak on comments                   |
| **Production risk**          | Low — Claude reliably nails this format       | Medium — bad evocative writing reads as cringe purple prose | Low — easy to generate, hard to differentiate | Lowest content risk; highest dependency on clip quality      |
| **Closest reference**        | News post style (FR/IT FB pages we built)     | Géomythe France reel; our Italy documentary        | BuzzFeed Animals, "Did You Know" pages       | Slow TV (Norwegian Slow TV); ambient nature YouTube channels |
| **TTS voice / speed**        | `af_bella` @ 1.00×                            | `af_bella` @ 0.85×                                 | `af_bella` @ 1.05×                           | none                                                         |
| **Captions burned in?**      | yes                                           | yes                                                | yes                                          | no                                                           |
| **Music mood**               | Uplifting                                     | Cinematic, epic                                    | Upbeat                                       | Ambient, dominant in mix                                     |
| **Music volume in mix**      | 0.10 (quiet under voice)                      | 0.14 (slightly louder, more presence)              | 0.12                                         | 0.35 (carries the whole reel)                                |
| **Target duration**          | ~30s                                          | ~45s                                               | ~30s                                         | ~30s                                                         |

## Per-style deep dive

### 1. Factual — Hook + 3 facts + CTA

**Structure (narration):**
1. Hook: one striking factual sentence
2. Fact 1: single concrete fact, ≤ 12 words
3. Fact 2: single concrete fact, ≤ 12 words
4. Fact 3: single concrete fact, ≤ 12 words
5. CTA: "Follow Wildlife Daily for more."

**Example narration:**
> "Lions can roar so loud, you can hear them eight kilometres away. A male lion eats up to seven kilos of meat a day. Lionesses do ninety percent of the hunting. A pride can have up to thirty members. Follow Wildlife Daily for more."

**When to use:**
- **Default for any wildlife reel.** Factual is the workhorse.
- Clip sets that span multiple species, angles, or moments — each clip can carry one fact.
- Goal is **comments + saves**. Facts trigger "did you know" tagging behaviour.

**When NOT to use:**
- Atmospheric footage with no clear subject (use cinematic).
- A single sustained moment — a hunt, a courtship, a kill — where facts feel out of place.

**Watch out for:**
- Same noun repeated 5×. Vary nouns and verbs.
- Inventing facts. Claude is told not to, but verify obvious ones (sizes, speeds, lifespans) on first runs.
- CTA pronunciation. Keep page names short and clean for TTS.

### 2. Cinematic — Evocative

**Structure (narration):**
1. Opening: sensory scene-setting, 1 sentence
2. Beat 1: a single observation or behaviour described poetically
3. Beat 2: a contrast or revelation
4. Close: short reverent line, 5-10 words

Narration ends in silence — the CTA appears only as an on-screen text overlay so the audio close stays clean.

**Example narration:**
> "In the golden hush of the savanna, the lioness lifts her chin. The herd freezes — they have heard her before. This is the language of patience, written in silence. She is older than every story we tell about her."

**When to use:**
- High-quality, slow-paced footage (slow motion, golden hour, intimate close-ups).
- Goal is **shares > comments**. Cinematic content is what people post to their stories.
- "Hero" reels — once a month, not every day. Cinematic burns out a feed.

**When NOT to use:**
- Choppy or mixed-quality clips. Cinematic depends on visual coherence.
- Topics where facts are the actual draw (apex predators, record-breakers). Use factual.

**Watch out for:**
- Purple prose. Banned words: "majestic", "incredible", "stunning", "amazing". Use specific sensory verbs and nouns.
- TTS at 0.85× sounds robotic on long sentences. Cap sentences at 15 words even at slow speed.
- Editing in post: if a line sounds off, fix the *script*, not the *speed*.

### 3. Listicle — Countdown

**Structure (narration):**
1. Hook: "[N] amazing facts about [topic]"
2. Items counted DOWN from N to 1, with the most striking fact LAST
3. CTA: "Follow Wildlife Daily for more"

**Example narration:**
> "Five amazing facts about lions. Number five: they can sleep twenty hours a day. Number four: cubs stay with mum for two years. Number three: their roar carries eight kilometres. Number two: lionesses do ninety percent of the hunting. Number one: a lion's mane shows its age. Follow Wildlife Daily for more."

**When to use:**
- **Cold-start of a new account.** Listicles have the highest initial click rate.
- Goal is **clicks + shares**. People share a listicle so friends can play "which fact didn't I know".
- Trend-pegged topics where quick lists ride attention.

**When NOT to use:**
- As a default. Listicles are a high-burn format — every reel feels the same after a few weeks.
- On Wild Cinema page. Breaks the brand voice.

**Watch out for:**
- **Putting the strongest fact first.** Always last. Watch-through depends on the viewer staying until #1.
- Item count > 5 at 30s. Feels exhausting.
- TTS at 1.05× clipping syllables. Verify rendered audio before publishing the first listicle.

### 4. Silent — Natural footage

**Structure:**
- No narration, no on-screen captions.
- Clips concatenated at 9:16, music + watermark, CTA fades in only in the **last 4 seconds**.
- Music plays uninterrupted at a much higher mix volume (0.35) than the narrated modes (0.10-0.14) because it carries the entire reel.

**When to use:**
- Pristine, single-subject footage (a lioness drinking, a wolf at dawn, a whale breaching).
- Clips whose natural sound + atmosphere would be ruined by a voice-over.
- Weekends — silent reels do better when viewers have time to watch without competing audio (commute earbuds, kitchen TVs).
- Content whose appeal is "I want to feel calm for 30 seconds".

**When NOT to use:**
- Choppy clip transitions — silent amplifies every bad cut.
- Multi-species reels. Silent works best with one subject sustained.
- When you actually have facts worth sharing. Silent leaves engagement on the table for that content.

**Watch out for:**
- Music drowning native ambience. **Future improvement**: detect whether source clips have meaningful audio (bird calls, water, wind) and mix at low gain *under* the music. Not yet implemented — see "Open questions" below.
- Slow pacing kills first-2s retention more than in narrated modes. Open with the strongest visual.

## Decision framework — which style for THIS content?

When a new clip set lands (from a fetcher or manual upload), walk through these questions in order:

**1. Is there a clear, single subject across all clips?**
- Yes, atmospheric → cinematic or silent
- Yes, with interesting facts available → factual or listicle
- Mixed subjects → factual

**2. What's the clip quality and pacing?**
- High quality, slow → cinematic or silent
- Mixed → factual or listicle
- Choppy → factual (facts hide pacing issues)

**3. Where is the destination page in its growth curve?**
- Cold start (<1k followers) → lean listicle for the first 2-3 weeks
- Growth (1k-10k) → mostly factual, occasional cinematic
- Established (10k+) → balanced mix; silent and cinematic as differentiators

**4. Which FB Page does this clip set belong to?**
- Wildlife Daily → factual + listicle only
- Wild Cinema → cinematic + silent only

**If two styles tie, default to factual.** It's the lowest-risk format and the algorithm rewards consistency.

## Metrics to watch per style

Per-style success criteria — don't average across styles when comparing pages.

| Style       | Primary metric              | Secondary             | Failure signal                                |
|-------------|-----------------------------|-----------------------|-----------------------------------------------|
| Factual     | Comments per 100 views      | Saves                 | Comments < 0.3% → fact framing is wrong       |
| Cinematic   | Shares per 100 views        | Watch-through %       | Share rate < 1% → not emotional enough        |
| Listicle    | First-2s retention          | Clicks on the post    | Watch-through < 40% → too long / bad pacing   |
| Silent      | Saves per 100 views         | Watch-through %       | Saves < 0.5% → not calming or visually weak   |

A cinematic-heavy page with fewer comments isn't underperforming — it's targeting saves and shares. Read each page against the right metric.

## How the style mix should evolve

**Month 1 (cold start):**
- Wildlife Daily: 70% factual, 30% listicle
- Wild Cinema: 50% cinematic, 50% silent

**Month 2-3 (first real data):**
- Inspect per-style metrics on each page.
- The style with the worst primary metric drops to ≤20% of mix.
- The style with the best metric does NOT go to 100% — diversity still helps the algorithm; cap any single style at ~70%.

**Month 6+:**
- If one style on a page is genuinely dominant (>3× engagement of the other), consider:
  - Promoting it to its own dedicated page, and
  - Finding a new style (e.g. educational shorts, ASMR, comparison reels) for the freed slot.
- Revisit page-style mapping. The current pairing (factual+listicle, cinematic+silent) is a hypothesis, not a rule.

## What we decided

Summary of choices made on **2026-05-26**, with rationale, so future contributors know what's hypothesis vs requirement.

| Decision                                                | What                                                                                   | Why                                                                                                                                              |
|---------------------------------------------------------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Four styles, not one or two                             | Build all four from day 1                                                              | Different audiences want different content; running all four in parallel gives a natural experiment within 4 weeks                               |
| Two FB Pages, not four                                  | Wildlife Daily (factual + listicle) and Wild Cinema (cinematic + silent)               | Growing four pages from zero is too thin per page; two pages with two styles each preserves brand voice while halving operational cost           |
| Factual first for M2 validation                         | First end-to-end test = `wildlife/factual/EN`                                          | Lowest production risk — if factual doesn't work the others won't either; gives us a known-good baseline                                         |
| English first, other languages later                    | All four launch channels are `*/EN`                                                    | English has the largest Reels audience globally; localisation comes after the format itself is proven                                            |
| Silent mode uses music only, not native clip audio      | Skip clip-native audio in renderer                                                     | Pexels clips often have studio-noise or no audio; clean royalty-free music is more reliable until we have an audio-quality detector              |
| Style is a first-class channel dimension                | Channel key = `niche/style/LANG` instead of just `niche/LANG`                          | A channel becomes the unit of "one consistent voice on one page on one cadence"; clean separation makes per-style metrics interpretable          |
| All styles share one Claude system prompt               | Single cached system prompt covers all four modes; user message picks mode             | Maximises prompt-cache hit rate (10% input cost after first call in a 5-min window) regardless of which mode is generated                        |

## Open questions / things to revisit

1. **AI voice variety per style.** All four styles use `af_bella`. Cinematic might benefit from a deeper voice (e.g. `am_michael`). Try a comparison render after ~5 reels per page exist.
2. **Native audio in silent mode.** Detect whether Pexels clips have meaningful audio (water, birds, wind) and mix under the music at low gain. Defer until the renderer can handle this without manual tuning per reel.
3. **Music selection per reel, not per channel.** Currently one music file per channel. Picking music dynamically from a small mood-tagged library could lift all narrated modes. Decide after first-month data.
4. **Per-platform style fit.** A factual reel that wins on Facebook may flop on TikTok and vice versa. When IG / YT / TT come online (M3+), track per-platform metrics per style and consider style-by-platform routing.
5. **Hook A/B within a style.** Even within factual, the first sentence of the narration is doing most of the work. Once we have stable engagement baselines, test 2-3 hook variants per reel via Claude and pick the winner by 24h watch-through.
6. **Listicle item count.** Currently fixed at 5. A 3-item or 7-item variant might perform differently on different pages. Test once Wildlife Daily has 50+ posts.

## Related docs

- [`architecture.md`](architecture.md) — overall system design, milestones, data flow.
- [`../CLAUDE.md`](../CLAUDE.md) — project guide; channel pattern + renderer modes.
- [`../src/services/claude.js`](../src/services/claude.js) — the actual system prompt that implements these styles.
