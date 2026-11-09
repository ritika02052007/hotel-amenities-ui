import { CATEGORIES, fetchAmenities, filterAmenities, sortAmenities } from './amenities.js';
import { nextStatus, countActive } from './requests.js';
import { validateRequest } from './validate.js';
import { sanitize } from './sanitize.js';
import { track } from './analytics.js';

const $ = (s) => document.querySelector(s);
const ICONS = {
  Wellness: 'M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z',
  Dining: 'M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9zM17 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3',
  Leisure: 'M2 8c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 14c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 20c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0',
  Services: 'M6 17V11a6 6 0 0 1 12 0v6l2 2H4l2-2zM10 21a2 2 0 0 0 4 0'
};
const FIELDS = ['name', 'room', 'amenity', 'time', 'notes'];

function loadRequests() {
  try { return (JSON.parse(localStorage.getItem('requests')) || []).map((r) => ({ status: 'Pending', ...r })); } catch { return []; }
}
function saveRequests(list) {
  try { localStorage.setItem('requests', JSON.stringify(list)); } catch { /* storage unavailable */ }
}
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const state = { amenities: [], query: '', category: 'All', sort: 'name', requests: loadRequests() };

function renderLoading() {
  const grid = $('#grid');
  grid.setAttribute('aria-busy', 'true');
  grid.replaceChildren(...Array.from({ length: 4 }, () => el('div', 'card skeleton')));
  $('#count').textContent = 'Loading amenities…';
}

function renderError() {
  const grid = $('#grid');
  grid.setAttribute('aria-busy', 'false');
  const box = el('div', 'notice');
  box.setAttribute('role', 'alert');
  const retry = el('button', 'btn btn-secondary', 'Retry');
  retry.type = 'button';
  retry.addEventListener('click', init);
  box.append(el('p', '', 'Amenities could not be loaded. Check your connection and retry.'), retry);
  grid.replaceChildren(box);
  $('#count').textContent = 'Loading failed.';
}

function renderGrid() {
  const grid = $('#grid');
  const items = sortAmenities(filterAmenities(state.amenities, state), state.sort);
  renderStats();
  grid.setAttribute('aria-busy', 'false');
  $('#count').textContent = `${items.length} amenities shown`;
  if (!items.length) {
    const empty = el('div', 'notice', 'No data found. Try a different search or category.');
    empty.setAttribute('role', 'status');
    grid.replaceChildren(empty);
    return;
  }
  grid.replaceChildren(...items.map((a) => {
    const card = el('article', 'card');
    const top = el('div', 'card-top');
    const tile = el('span', 'icon');
    tile.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${ICONS[a.category]}"/></svg>`;
    top.append(tile, el('span', `badge badge-${a.status.toLowerCase().replace(/\s+/g, '-')}`, a.status));
    const foot = el('div', 'card-foot');
    const ask = el('button', 'btn btn-small', 'Request');
    ask.type = 'button';
    ask.setAttribute('aria-label', `Request ${a.name}`);
    ask.addEventListener('click', () => {
      $('#amenity').value = a.name;
      $('#request').scrollIntoView();
      $('#name').focus({ preventScroll: true });
      track(`request-started:${a.name}`);
    });
    foot.append(el('span', 'meta', a.hours), ask);
    card.append(top, el('h3', '', a.name), el('p', 'desc', a.description), foot);
    return card;
  }));
}

function renderStats() {
  $('#stat-total').textContent = state.amenities.length;
  $('#stat-open').textContent = state.amenities.filter((x) => x.status === 'Open').length;
  $('#stat-active').textContent = countActive(state.requests);
}

function renderRequests() {
  const list = $('#requests');
  renderStats();
  $('#clear').hidden = !state.requests.some((r) => r.status === 'Completed');
  if (!state.requests.length) {
    list.replaceChildren(el('li', 'notice', 'No data found. Submitted requests will appear here.'));
    return;
  }
  list.replaceChildren(...state.requests.map((r) => {
    const li = el('li', 'request');
    const head = el('div', 'request-head');
    head.append(el('strong', '', `${r.amenity} for room ${r.room}`), el('span', `badge st-${r.status.toLowerCase().replace(/\s+/g, '-')}`, r.status));
    li.append(head, el('span', 'meta', `${r.name} · ${r.time}`));
    if (r.notes) li.append(el('span', '', r.notes));
    const actions = el('div', 'request-actions');
    if (r.status !== 'Completed') {
      const go = el('button', 'btn btn-small', r.status === 'Pending' ? 'Start' : 'Complete');
      go.type = 'button';
      go.setAttribute('aria-label', `${go.textContent} request for room ${r.room}`);
      go.addEventListener('click', () => advance(r.id, false));
      actions.append(go);
    }
    const del = el('button', 'btn btn-small', 'Remove');
    del.type = 'button';
    del.setAttribute('aria-label', `Remove request for room ${r.room}`);
    del.addEventListener('click', () => {
      state.requests = state.requests.filter((x) => x.id !== r.id);
      saveRequests(state.requests);
      renderRequests();
      track('request-removed');
    });
    actions.append(del);
    li.append(actions);
    return li;
  }));
}

function advance(id, auto) {
  const r = state.requests.find((x) => x.id === id);
  if (!r || r.status === 'Completed') return;
  r.status = nextStatus(r.status);
  saveRequests(state.requests);
  renderRequests();
  if (auto) toast(`${r.amenity} for room ${r.room} is now ${r.status.toLowerCase()}.`);
  track(`request-${r.status.toLowerCase().replace(/\s+/g, '-')}`);
}

function schedule(id) {
  setTimeout(() => {
    const r = state.requests.find((x) => x.id === id);
    if (!r || r.status === 'Completed') return;
    advance(id, true);
    schedule(id);
  }, 7000);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const b = $('#theme');
  b.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  b.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

function tick() {
  $('#clock').textContent = new Date().toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function renderChips() {
  $('#chips').replaceChildren(...CATEGORIES.map((c) => {
    const b = el('button', 'chip', c);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(c === state.category));
    b.addEventListener('click', () => {
      state.category = c;
      renderChips();
      renderGrid();
      track(`filter:${c}`);
    });
    return b;
  }));
}

function showErrors(errors) {
  FIELDS.forEach((f) => {
    const input = $(`#${f}`);
    const bad = Boolean(errors[f]);
    input.classList.toggle('is-invalid', bad);
    if (bad) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    $(`#${f}-error`).textContent = errors[f] || '';
  });
}

function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

function onSubmit(event) {
  event.preventDefault();
  const raw = Object.fromEntries(FIELDS.map((f) => [f, $(`#${f}`).value]));
  const errors = validateRequest(raw);
  showErrors(errors);
  if (Object.keys(errors).length) { $(`#${Object.keys(errors)[0]}`).focus(); return; }
  const clean = Object.fromEntries(FIELDS.map((f) => [f, sanitize(raw[f])]));
  const created = { id: Date.now(), status: 'Pending', ...clean };
  state.requests = [created, ...state.requests];
  saveRequests(state.requests);
  renderRequests();
  event.target.reset();
  toast('Request sent to the floor team.');
  track('request-submitted');
  schedule(created.id);
}

async function init() {
  renderLoading();
  try {
    state.amenities = await fetchAmenities({ fail: new URLSearchParams(location.search).has('fail') });
    const placeholder = el('option', '', 'Choose an amenity');
    placeholder.value = '';
    $('#amenity').replaceChildren(placeholder, ...state.amenities.map((a) => el('option', '', a.name)));
    renderGrid();
  } catch {
    renderError();
  }
}

$('#search').addEventListener('input', (e) => { state.query = sanitize(e.target.value); renderGrid(); });
$('#search').addEventListener('change', () => track('search'));
$('#sort').addEventListener('change', (e) => { state.sort = e.target.value; renderGrid(); track(`sort:${state.sort}`); });
$('#clear').addEventListener('click', () => {
  state.requests = state.requests.filter((r) => r.status !== 'Completed');
  saveRequests(state.requests);
  renderRequests();
  track('completed-cleared');
});
$('#theme').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
  track(`theme:${next}`);
});
$('#request-form').addEventListener('submit', onSubmit);
try { applyTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark'); } catch { applyTheme('dark'); }
tick();
setInterval(tick, 30000);
renderChips();
renderRequests();
state.requests.filter((r) => r.status !== 'Completed').forEach((r) => schedule(r.id));
init();
