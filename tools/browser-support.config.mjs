export const browserSupportProfiles = {
  accordion: ['light-dark', 'contrast-color', 'interpolate-size'],
  alert: ['light-dark', 'contrast-color', 'container-queries'],
  autocomplete: ['light-dark', 'contrast-color', 'popover', 'anchor-name', 'starting-style', 'transition-behavior'],
  avatar: ['light-dark'],
  badge: ['light-dark', 'contrast-color'],
  barcode: ['light-dark', 'contrast-color'],
  button: ['light-dark', 'contrast-color'],
  card: ['light-dark', 'contrast-color'],
  checkbox: ['light-dark', 'contrast-color', 'popover', 'anchor-name'],
  chip: ['light-dark', 'contrast-color'],
  datepicker: ['light-dark', 'contrast-color', 'popover', 'anchor-name', 'starting-style', 'transition-behavior', 'temporal'],
  dialog: ['light-dark', 'contrast-color', 'dialog-closedby', 'invoker-commands', 'starting-style', 'transition-behavior'],
  drawer: ['light-dark', 'contrast-color', 'dialog-closedby', 'invoker-commands', 'starting-style', 'transition-behavior'],
  input: ['light-dark', 'contrast-color', 'has', 'popover', 'anchor-name', 'starting-style', 'transition-behavior'],
  loading: ['light-dark'],
  menu: ['light-dark', 'popover', 'anchor-name', 'starting-style', 'transition-behavior'],
  popover: [
    'light-dark',
    'contrast-color',
    'popover',
    'invoker-commands',
    'anchor-name',
    'starting-style',
    'transition-behavior',
  ],
  progress: ['light-dark'],
  radio: ['light-dark', 'contrast-color', 'popover', 'anchor-name'],
  select: ['light-dark', 'popover', 'anchor-name', 'starting-style', 'transition-behavior'],
  skeleton: ['light-dark'],
  sonner: ['light-dark', 'contrast-color', 'has', 'interpolate-size'],
  switch: ['light-dark', 'contrast-color', 'popover', 'anchor-name'],
  table: [
    'light-dark',
    'contrast-color',
    'scrollbar-color',
    'scrollbar-gutter',
    'scrollbar-width',
  ],
  tabs: [
    'light-dark',
    'contrast-color',
    'has',
    'anchor-name',
    'scrollbar-width',
  ],
  tooltip: ['light-dark', 'popover-hint', 'interest-invokers', 'starting-style', 'transition-behavior'],
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
