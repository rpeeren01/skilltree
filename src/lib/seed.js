export const SKILLS = [
  { id: 'deep-work',   name: 'Deep Work',         unit: 'hours',    xpPerUnit: 50,  level: 1, currentXP: 0, history: [] },
  { id: 'reading',     name: 'Reading',            unit: 'pages',    xpPerUnit: 5,   level: 1, currentXP: 0, history: [] },
  { id: 'datacenter',  name: 'Datacenter Know.',   unit: 'modules',  xpPerUnit: 80,  level: 1, currentXP: 0, history: [] },
  { id: 'sales',       name: 'Sales & Outreach',   unit: 'contacts', xpPerUnit: 15,  level: 1, currentXP: 0, history: [] },
  { id: 'code',        name: 'Code & Building',    unit: 'commits',  xpPerUnit: 20,  level: 1, currentXP: 0, history: [] },
  { id: 'marketing',   name: 'Marketing & Growth', unit: 'posts',    xpPerUnit: 30,  level: 1, currentXP: 0, history: [] },
  { id: 'finance',     name: 'Financial Analysis', unit: 'deals',    xpPerUnit: 60,  level: 1, currentXP: 0, history: [] },
  { id: 'fitness',     name: 'Fitness',            unit: 'workouts', xpPerUnit: 70,  level: 1, currentXP: 0, history: [] },
  { id: 'sleep',       name: 'Sleep Quality',      unit: 'nights',   xpPerUnit: 60,  level: 1, currentXP: 0, history: [] },
  { id: 'phone',       name: 'Phone Control',      unit: 'hours',    xpPerUnit: 40,  level: 1, currentXP: 0, history: [] },
  { id: 'procflow',    name: 'ProcFlow Dev',        unit: 'sprints',  xpPerUnit: 90,  level: 1, currentXP: 0, history: [] },
  { id: 'vault',       name: 'Vault Content',       unit: 'videos',   xpPerUnit: 120, level: 1, currentXP: 0, history: [] },
  { id: 'networking',  name: 'Networking',          unit: 'contacts', xpPerUnit: 25,  level: 1, currentXP: 0, history: [] },
  { id: 'learning',    name: 'Learning & Courses',  unit: 'lessons',  xpPerUnit: 35,  level: 1, currentXP: 0, history: [] },
];

export const INITIAL_DAILY_QUESTS = [
  { id: 'dq1', type: 'daily', title: 'XP Grinder',    desc: 'Gain 500 XP total',          goal: 500, progress: 0, unit: 'xp',        reward: { gold: 100 },              claimed: false },
  { id: 'dq2', type: 'daily', title: 'Bookworm',      desc: 'Read 20 pages',              goal: 20,  progress: 0, unit: 'reading',   reward: { gold: 50, bonusXp: 200 }, claimed: false },
  { id: 'dq3', type: 'daily', title: 'Digital Detox', desc: '1 hour phone-free',          goal: 1,   progress: 0, unit: 'phone',     reward: { gold: 75 },               claimed: false },
  { id: 'dq4', type: 'daily', title: 'Level Seeker',  desc: 'Level up any skill',         goal: 1,   progress: 0, unit: 'levelup',   reward: { gold: 200 },              claimed: false },
  { id: 'dq5', type: 'daily', title: 'Deep Focus',    desc: 'Log 2 hours of deep work',   goal: 2,   progress: 0, unit: 'deep-work', reward: { gold: 80 },               claimed: false },
];

export const INITIAL_WEEKLY_QUESTS = [
  { id: 'wq1', type: 'weekly', title: 'Century Reader',   desc: 'Read 100 pages this week',   goal: 100, progress: 0, unit: 'reading',   reward: { gold: 500 },  claimed: false },
  { id: 'wq2', type: 'weekly', title: 'Deep Work Grind',  desc: 'Log 50 hours of deep work',  goal: 50,  progress: 0, unit: 'deep-work', reward: { gold: 750 },  claimed: false },
  { id: 'wq3', type: 'weekly', title: 'Milestone Hunter', desc: 'Reach a new skill milestone', goal: 1,   progress: 0, unit: 'levelup',   reward: { gold: 400 },  claimed: false },
  { id: 'wq4', type: 'weekly', title: 'Phone Free Week',  desc: '3 days no-phone logged',      goal: 3,   progress: 0, unit: 'phone',     reward: { gold: 300 },  claimed: false },
];

export const INITIAL_MILESTONES = [
  { id: 'ms1', type: 'milestone', title: 'Master of One',      desc: 'Reach Level 10 in any skill', goal: 10,    progress: 0, unit: 'maxlevel', reward: { gold: 1000, badge: 'Master' },       claimed: false },
  { id: 'ms2', type: 'milestone', title: 'Ten Thousand Club',  desc: 'Earn 10,000 total XP',        goal: 10000, progress: 0, unit: 'totalxp',  reward: { gold: 2000, badge: 'Avatar Glow' },  claimed: false },
  { id: 'ms3', type: 'milestone', title: 'Week Warrior',       desc: 'Maintain a 7-day streak',     goal: 7,     progress: 0, unit: 'streak',   reward: { gold: 1500, badge: 'The Ascended' }, claimed: false },
];

export const COSMETICS = [
  { id: 'skin-neon',      type: 'cardskin', name: 'Neon Skin',        cost: 120, owned: false, equipped: false },
  { id: 'skin-gold',      type: 'cardskin', name: 'Gold Skin',        cost: 200, owned: false, equipped: false },
  { id: 'skin-minimal',   type: 'cardskin', name: 'Minimalist Skin',  cost: 80,  owned: false, equipped: false },
  { id: 'avatar-hacker',  type: 'avatar',   name: 'Hacker',           cost: 150, owned: false, equipped: false },
  { id: 'avatar-gym',     type: 'avatar',   name: 'Gym Bro',          cost: 150, owned: false, equipped: false },
  { id: 'avatar-scholar', type: 'avatar',   name: 'Scholar',          cost: 150, owned: false, equipped: false },
  { id: 'avatar-default', type: 'avatar',   name: 'Entrepreneur',     cost: 0,   owned: true,  equipped: true  },
  { id: 'title-deepwork', type: 'title',    name: 'Deep Work Master', cost: 100, owned: false, equipped: false },
  { id: 'title-growth',   type: 'title',    name: 'Growth Hacker',    cost: 100, owned: false, equipped: false },
  { id: 'title-ascended', type: 'title',    name: 'The Ascended',     cost: 300, owned: false, equipped: false },
  { id: 'effect-golden',  type: 'effect',   name: 'Golden Burst',     cost: 180, owned: false, equipped: false },
];

export const CONVERTER_REWARDS = [
  { id: 'gaming',  name: '1 Hour Gaming Session',  goldCost: 1000, value: '$10' },
  { id: 'coffee',  name: 'Coffee / Meal',           goldCost: 1000, value: '$10' },
  { id: 'amazon',  name: '$10 Amazon Credit',       goldCost: 1000, value: '$10' },
  { id: 'gym',     name: 'Gym Membership Credit',   goldCost: 1000, value: '$10' },
];

export const GOLD_PER_DOLLAR = 100;

export const AVATARS = [
  { id: 'avatar-default', label: 'Entrepreneur' },
  { id: 'avatar-hacker',  label: 'Hacker' },
  { id: 'avatar-gym',     label: 'Gym Bro' },
  { id: 'avatar-scholar', label: 'Scholar' },
];
