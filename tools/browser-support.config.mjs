export const browserSupportProfiles = {
  accordion: ['light-dark', 'interpolate-size'],
  alert: ['light-dark', 'contrast-color', 'container-queries'],
  autocomplete: [
    'light-dark',
    'backdrop-filter',
    'popover',
    'anchor-name',
    'starting-style',
    'transition-behavior',
  ],
  avatar: ['light-dark'],
  badge: ['light-dark'],
  barcode: ['light-dark'],
  button: ['light-dark'],
  card: ['light-dark', 'backdrop-filter'],
  checkbox: ['light-dark', 'popover', 'anchor-name'],
  chip: ['light-dark'],
  datepicker: [
    'light-dark',
    'backdrop-filter',
    'popover',
    'anchor-name',
    'starting-style',
    'transition-behavior',
    'temporal',
  ],
  dialog: [
    'light-dark',
    'dialog-closedby',
    'invoker-commands',
    'starting-style',
    'transition-behavior',
  ],
  drawer: [
    'light-dark',
    'dialog-closedby',
    'invoker-commands',
    'starting-style',
    'transition-behavior',
  ],
  input: ['light-dark', 'has', 'popover', 'anchor-name', 'starting-style', 'transition-behavior'],
  loading: ['light-dark'],
  menu: [
    'light-dark',
    'backdrop-filter',
    'popover',
    'pointer-events-api',
    'anchor-name',
    'starting-style',
    'transition-behavior',
  ],
  popover: [
    'light-dark',
    'popover',
    'invoker-commands',
    'anchor-name',
    'starting-style',
    'transition-behavior',
  ],
  progress: ['light-dark'],
  radio: ['light-dark', 'popover', 'anchor-name'],
  select: [
    'light-dark',
    'backdrop-filter',
    'popover',
    'anchor-name',
    'starting-style',
    'transition-behavior',
  ],
  skeleton: ['light-dark'],
  sonner: ['light-dark', 'has', 'popover', 'starting-style', 'interpolate-size'],
  switch: ['light-dark', 'popover', 'anchor-name'],
  table: ['light-dark', 'scrollbar-color', 'scrollbar-gutter', 'scrollbar-width'],
  tabs: ['light-dark', 'has', 'anchor-name', 'scrollbar-width'],
  tooltip: [
    'light-dark',
    'popover-hint',
    'interest-invokers',
    'starting-style',
    'transition-behavior',
  ],
  tree: ['light-dark', 'interpolate-size'],
};

// Use the exact BCD-backed subset exercised by the components. The umbrella
// Anchor Positioning feature also includes syntax that these components do not use.
export const featureSources = {
  'anchor-name': ['anchor-positioning', 'css.properties.anchor-name'],
};

// web-features tracks browsers only, so JS features that the dev/test
// toolchain also executes (vitest runs on Node) list their Node.js minimum
// here by hand. CSS/DOM features never run in Node and stay out of this map.
export const nodeMinimums = {
  temporal: '26',
};
