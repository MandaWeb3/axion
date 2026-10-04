import { hasFinePointer, prefersReducedMotion } from './preferences.js';

/** The five ANDRA agent authority bands, lowest first. */
const RUNGS = [
  {
    tag: 'R1',
    name: 'Sandbox',
    runs: 'Synthetic or masked data, with no production access.',
    evidence: 'Evaluation suite passed and red-team findings closed.',
  },
  {
    tag: 'R2',
    name: 'Shadow',
    runs: 'Runs in parallel on live inputs. Decisions are logged, never executed.',
    evidence: 'At least 95% policy match over 30 days, with stable drift.',
  },
  {
    tag: 'R3',
    name: 'Assisted',
    runs: 'The agent recommends and a human acts. Both are logged.',
    evidence: 'Acceptance rate at target and Authority Card signed.',
  },
  {
    tag: 'R4',
    name: 'Bounded live',
    runs: 'Executes within the thresholds of its Authority Card.',
    evidence: 'Economics scorecard positive and audit clean.',
  },
  {
    tag: 'R5',
    name: 'Autonomous',
    runs: 'No human gate. Deterministic, reversible work only.',
    evidence: 'Sustained R4 performance plus risk-committee sign-off.',
  },
];

const INITIAL_RUNG = 2;
/** Matches the `.rung-panel .swap` fade-out before new content is shown. */
const SWAP_MS = 220;

/** Tab list of authority bands with a detail panel describing the selected band. */
export function initAuthorityLadder() {
  const list = document.getElementById('rungs');
  const panel = document.getElementById('rungPanel');
  const fields = {
    tag: document.getElementById('rpTag'),
    name: document.getElementById('rpName'),
    runs: document.getElementById('rpRuns'),
    evidence: document.getElementById('rpEvidence'),
  };

  const buttons = RUNGS.map(createRungButton);
  list.replaceChildren(...buttons);

  let current = -1;
  let swapTimer = 0;

  const renderPanel = (rung) => {
    for (const [key, element] of Object.entries(fields)) element.textContent = rung[key];
    panel.classList.remove('out');
  };

  const select = (index, { focus = false, animate = true } = {}) => {
    if (index === current) return;
    current = index;

    buttons.forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', buttons[index].id);
    if (focus) buttons[index].focus();

    clearTimeout(swapTimer);
    if (!animate || prefersReducedMotion) {
      renderPanel(RUNGS[index]);
      return;
    }
    panel.classList.add('out');
    swapTimer = setTimeout(() => renderPanel(RUNGS[index]), SWAP_MS);
  };

  const last = RUNGS.length - 1;
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    if (hasFinePointer) button.addEventListener('mouseenter', () => select(index));

    // Rungs are stacked bottom-up, so Up/Right climbs and Down/Left descends.
    button.addEventListener('keydown', (event) => {
      const next = {
        ArrowUp: Math.min(last, index + 1),
        ArrowRight: Math.min(last, index + 1),
        ArrowDown: Math.max(0, index - 1),
        ArrowLeft: Math.max(0, index - 1),
        Home: 0,
        End: last,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next, { focus: true });
    });
  });

  select(INITIAL_RUNG, { animate: false });
}

function createRungButton(rung, index) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'rung';
  button.id = `rung${index}`;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-controls', 'rungPanel');
  button.setAttribute('aria-selected', 'false');
  button.tabIndex = -1;
  button.append(createSpan('r', rung.tag), createSpan('n', rung.name), createSpan('bar'));
  return button;
}

function createSpan(className, text = '') {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}
