export const ACTIONS = {
  orbitLeft: 'orbitLeft',
  orbitRight: 'orbitRight',
  orbitUp: 'orbitUp',
  orbitDown: 'orbitDown',
  zoomIn: 'zoomIn',
  zoomOut: 'zoomOut',
  reset: 'reset',
};

export const KEYBINDINGS = {
  ArrowLeft: ACTIONS.orbitLeft,
  ArrowRight: ACTIONS.orbitRight,
  ArrowUp: ACTIONS.orbitUp,
  ArrowDown: ACTIONS.orbitDown,
  Equal: ACTIONS.zoomIn,
  NumpadAdd: ACTIONS.zoomIn,
  Minus: ACTIONS.zoomOut,
  NumpadSubtract: ACTIONS.zoomOut,
  KeyR: ACTIONS.reset,
};
