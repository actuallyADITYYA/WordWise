const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};
const make = (children) =>
  function Icon(props) {
    return (
      <svg {...base} {...props}>
        {children}
      </svg>
    );
  };

export const HelpIcon = make(
  <>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M9.4 9.2a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.2-2.6 3.8" />
    <path d="M12 17.4h.01" />
  </>,
);
export const StatsIcon = make(
  <>
    <path d="M5 20V11" />
    <path d="M12 20V4" />
    <path d="M19 20v-6" />
  </>,
);
export const SettingsIcon = make(
  <>
    <path d="M4 7h10" />
    <path d="M18 7h2" />
    <circle cx="16" cy="7" r="2" />
    <path d="M4 17h2" />
    <path d="M10 17h10" />
    <circle cx="8" cy="17" r="2" />
  </>,
);
export const BulbIcon = make(
  <>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
  </>,
);
export const TargetIcon = make(
  <>
    <rect x="3" y="7" width="18" height="10" rx="2.5" />
    <path d="M12 7v10" strokeDasharray="0.1 3" />
    <path d="M7.5 12h.01M16.5 12h.01" />
  </>,
);
export const CrossIcon = make(
  <>
    <path d="M5 5l14 14" />
    <path d="M19 5L5 19" />
  </>,
);
export const BackspaceIcon = make(
  <>
    <path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
    <path d="M17 9.5l-5 5M12 9.5l5 5" />
  </>,
);
export const ShareIcon = make(
  <>
    <rect x="8" y="8" width="12" height="12" rx="2.5" />
    <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" />
  </>,
);
export const RefreshIcon = make(
  <>
    <path d="M20 11a8 8 0 0 0-14.5-4.2L4 8.5" />
    <path d="M4 4v4.5h4.5" />
    <path d="M4 13a8 8 0 0 0 14.5 4.2L20 15.5" />
    <path d="M20 20v-4.5h-4.5" />
  </>,
);
export const CloseIcon = CrossIcon;
