# BUILD BRIEF — "ASCEND" — RuneScape-Style Skill Tree for Robin

You are implementing a fully functional React + Vite + Tailwind gamified productivity app.
The project is ALREADY scaffolded at this directory. Dependencies installed:
- react, react-dom (vite react template)
- zustand (state)
- canvas-confetti (level-up celebration)
- recharts (stats dashboard)
- tailwindcss@3 + postcss + autoprefixer (configs ALREADY written: tailwind.config.js, postcss.config.js)

DO NOT re-scaffold or re-run npm create. Just write source files.

## North Star
ADHD dopamine engine. Every action gives instant, satisfying feedback. It must LOOK like a premium game, not a productivity app. Dark mode, gold accents, neon highlights, glow, confetti, sound.

## App name: ASCEND. Tagline: "Level up your life."

## Tech / Structure
Single-page app, hash-based tab navigation (no router dependency needed — use Zustand `activeTab` state OR react-router if you prefer; keep it simple, prefer Zustand tab state). Mobile-first, responsive 375px → 1440px.

Persist ALL state to localStorage via Zustand `persist` middleware (key: "ascend-store-v1"). Offline-first.

### Files to create
```
src/
  main.jsx              (entry — ensure index.css imported)
  index.css             (tailwind directives + base styles + Google Fonts import for Outfit & Inter)
  App.jsx               (shell: top bar with Gold + Streak, tab content switch, bottom nav, toast container, level-up modal)
  store/useStore.js     (Zustand store w/ persist: all data + actions)
  lib/leveling.js       (xpForLevel, totalXpForLevel, applyXp logic, crit/treasure rolls)
  lib/seed.js           (the 12+ skills, initial quests, cosmetics catalog, reward converter config)
  lib/sound.js          (WebAudio synth tones — no asset files: ding, levelup, coin, sad — respects soundEnabled flag)
  lib/quests.js         (quest progress eval, daily/weekly reset logic, claim)
  components/
    TopBar.jsx          (Gold counter w/ coinPop animation, Streak flame counter)
    BottomNav.jsx       (Home, Skills, Quests, Store, Stats icons — SVG inline, no emoji)
    SkillCard.jsx       (icon, name, level badge, XP progress bar w/ smooth fill, "next level in X")
    SkillDetail.jsx     (modal/screen: big XP bar, add-XP input w/ unit, xpPerUnit editable, last 5 level history)
    QuestCard.jsx       (title, desc, progress bar, gold reward, claim button when complete)
    StoreItem.jsx       (cosmetic card: preview, name, cost, owned/equip/buy)
    Converter.jsx       (gold -> real reward redemption UI)
    LevelUpModal.jsx    (full-screen celebration: confetti fires, level number, rewards, crit/treasure banner)
    Toast.jsx           (floating toasts: xp gain, gold, streak warning)
    StatsDashboard.jsx  (recharts: XP per skill bar chart, total XP over time line, gold history)
    Onboarding.jsx      (2-3 screen intro, set username + pick avatar, only shows if !onboarded)
  screens/
    Home.jsx            (streak hero, active quests rotating, skill grid preview)
    Skills.jsx          (full skill grid -> opens SkillDetail)
    Quests.jsx          (Daily / Weekly / Milestone tabs)
    Store.jsx           (cosmetics grid + Converter section)
    Stats.jsx           (StatsDashboard + lifetime stats)
```
Adapt file set as needed but cover all features.

## LEVELING (lib/leveling.js)
- Level 1 is start. XP to go from level L to L+1:
  - base = 100, growth = 1.5
  - xpForLevel(L) = round(100 * 1.5^(L-1))  → L1→2:100, 2→3:150, 3→4:225, 4→5:337...
- Track per skill: level, currentXP (progress into current level), xpPerUnit, unit, history[].
- applyXp(skill, amount): add to currentXP, roll over multiple levels if needed, each level grants +10 gold (scaled: gold = 10 * newLevel), push history entry { level, gainedAt, goldReward }, return events array (levelups, gold, crit, treasure).
- CRIT: on each XP-add action, 12% chance → 2x the XP applied + small bonus gold. Show "CRIT LOOT!" banner.
- TREASURE: on each LEVEL-UP, 1-in-10 (10%) chance → treasure chest: +bonus gold (50-150 random) + bonus XP. Show treasure banner.
- Apply global xpMultiplier from skill points (see below) and streak bonus.

## SKILL POINTS / STATS
- Each level-up grants +1 skill point (global pool: `skillPoints`).
- Spend in a small "Perks" area (can live in Stats screen or Settings):
  - XP Multiplier: +5% global XP per point (cost scales)
  - Crit Chance: +2% per point
  - Daily Gold Bonus: +5 gold per daily login per point
  Keep it simple but functional — spending reduces skillPoints and updates perk levels in store.

## STREAK
- `streakDays`, `lastCheckIn` (date string YYYY-MM-DD).
- Any XP gain on a new calendar day → streak++ if yesterday was last check-in, else reset to 1.
- If a day was missed (gap > 1 day) → streak resets to 1, fire "sad" sound + red flash toast.
- 7-day streak → streakBonus multiplier (e.g., +20% gold) active; show flame intensifies.
- Home shows big streak number with flame SVG. Warn when streak at risk (no check-in today, evening) via toast on app open.

## SEED DATA (lib/seed.js)
12 core skills (pre-configured, sensible xpPerUnit + unit). Use inline SVG icon keys (map name->svg in a component) — NO emoji icons:
1. Deep Work — unit "hours", 50 XP/hr
2. Reading — unit "pages", 5 XP/page
3. Datacenter Knowledge — unit "modules", 80 XP/module
4. Sales & Outreach — unit "contacts", 15 XP each
5. Code & Building — unit "commits", 20 XP/commit
6. Marketing & Growth — unit "posts", 30 XP/post
7. Financial Analysis — unit "deals", 60 XP/deal
8. Fitness — unit "workouts", 70 XP/workout
9. Sleep Quality — unit "nights", 60 XP/night (7.5h+)
10. Phone Control — unit "hours", 40 XP/phone-free hour
11. ProcFlow Dev — unit "sprints", 90 XP/sprint
12. Vault Content — unit "videos", 120 XP/video
(+ add 2 more relevant: "Networking" contacts 25xp, "Learning/Courses" lessons 35xp)

DAILY QUESTS (3-5, reset 24h): "Gain 500 XP"→100g; "Read 20 pages"→50g+bonus; "1 hour phone-free"→75g; "Level up any skill"→200g.
WEEKLY QUESTS (reset Sunday): "100 pages read"→500g; "50 hours deep work"→750g; "Reach a new skill milestone"→400g; "3 days no-phone"→300g.
MILESTONE (one-time): "Reach Level 10 in any skill"→1000g+Badge; "10k total XP"→2000g+Avatar glow; "7-day streak"→1500g+Title.

COSMETICS CATALOG (8-10 items, gold cost):
- Card skins: Neon (120g), Gold (200g), Minimalist (80g)
- Avatar skins: Hacker (150g), Gym Bro (150g), Scholar (150g), Entrepreneur (default/owned)
- Titles: "Deep Work Master" (100g), "Growth Hacker" (100g), "The Ascended" (300g)
- Particle effect: "Golden Burst" level-up (180g)
Items have { id, type, name, cost, owned:false, equipped:false }. Buying deducts gold, sets owned. Equipping (for skin/title/avatar/effect) sets equipped + unequips siblings of same type.

REAL-WORLD CONVERTER config: ratio 1000 gold = $10. Redeemable rewards list:
- "1 Hour Gaming Session" ($10 / 1000g)
- "Coffee / Meal" ($10 / 1000g)
- "$10 Amazon Credit" (1000g)
- "Gym Membership Credit $10" (1000g)
Redeeming deducts gold, logs to a `redemptions[]` history with timestamp. Show "$ value" hint next to gold balance and on quests ("this quest = $0.50").

## SOUND (lib/sound.js)
Use Web Audio API oscillators (no asset files). Functions: playDing(), playLevelUp() (ascending arpeggio), playCoin() (quick blip), playSad() (descending). Gate all on store.soundEnabled. Lazy-init AudioContext on first user gesture.

## DOPAMINE / ANIMATIONS
- XP bar fills smoothly via CSS width transition (use the tailwind config animations + transition-all duration-500 ease-out).
- Gold counter: coinPop animation + playCoin on increase. Animate number count-up.
- LevelUpModal: canvas-confetti burst (fire from bottom + a couple bursts), big level number scale-in, list rewards, "CONTINUE" button. Crit/treasure variants more intense (gold confetti).
- Toasts: floatUp animation, auto-dismiss 2.5s, stack top.
- Skill card glow (animate-pulseGlow) briefly on level-up.
- Subtle animated gradient background on body (gradientShift) — dark, premium.

## DESIGN SYSTEM
- bg #0A0A0F, cards #13131D, border #262636. Gold #FFD700, neon #00F0FF, neonGreen #39FF14, danger #FF3B3B.
- Fonts: Outfit (display/headers), Inter (body) — import via index.css @import url google fonts.
- Rounded-2xl cards, soft shadows, glow on accents. Big bold numbers. Touch targets >=44px. cursor-pointer on clickables. Hover transitions 150-300ms. Respect prefers-reduced-motion (disable heavy animations). No emoji as UI icons — inline SVG (lucide-style paths) only.

## ONBOARDING
If !onboarded: 2-3 swipeable/next screens — (1) welcome + tagline, (2) explain XP/gold/streak, (3) enter username + pick avatar from the avatars list. Set onboarded=true, store username + avatar.

## ACCEPTANCE
- `npm run build` passes with no errors.
- App loads, onboarding flows, can add XP to a skill, see XP bar fill, trigger level-up modal w/ confetti + sound, gold increases, quests track + claim, store buy/equip works, converter redeems, stats dashboard renders charts, streak tracks across days, everything persists on reload.
- Mobile responsive. No console errors.

## After build
Run `npm run build`. Fix any errors until it builds clean. Report what you built, file list, and confirm build success. DO NOT deploy — the parent agent handles Vercel deploy.

BUILD IT NOW. Make it stunning.
