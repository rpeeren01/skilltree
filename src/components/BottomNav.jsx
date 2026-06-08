import useStore from '../store/useStore.js';

const TABS = [
  { id: 'home',   label: 'Home',   Icon: HomeIcon },
  { id: 'skills', label: 'Skills', Icon: SkillsIcon },
  { id: 'quests', label: 'Quests', Icon: QuestsIcon },
  { id: 'store',  label: 'Store',  Icon: StoreIcon },
  { id: 'stats',  label: 'Stats',  Icon: StatsIcon },
];

export default function BottomNav() {
  const activeTab = useStore(s => s.activeTab);
  const setActiveTab = useStore(s => s.setActiveTab);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: '#0A0A0F',
        borderTop: '1px solid #262636',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-3 cursor-pointer transition-all duration-150"
            style={{
              background: 'transparent',
              border: 'none',
              color: active ? '#FFD700' : '#888899',
              minHeight: 56,
            }}
          >
            <Icon active={active} />
            <span
              className="text-[10px] font-display font-semibold"
              style={{ color: active ? '#FFD700' : '#888899' }}
            >
              {label}
            </span>
            {active && (
              <span
                className="absolute bottom-0 w-6 h-0.5 rounded-full"
                style={{ background: '#FFD700' }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#FFD700' : 'none'} stroke={active ? '#FFD700' : '#888899'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function SkillsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFD700' : '#888899'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function QuestsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFD700' : '#888899'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function StoreIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFD700' : '#888899'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function StatsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFD700' : '#888899'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
