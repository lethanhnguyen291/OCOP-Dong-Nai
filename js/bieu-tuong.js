const icons = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  box: '<path d="m12 3 9 5v9l-9 5-9-5V8z M3 8l9 5 9-5 M12 13v9 M7 5.8l9 5"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.8 5.2L8 16l2.8-5.2z"/>',
  link: '<path d="m10 13 4-4 M9 16l-1 1a3.6 3.6 0 1 1-5-5l4-4a3.5 3.5 0 0 1 5 0 M15 8l1-1a3.6 3.6 0 1 1 5 5l-4 4a3.5 3.5 0 0 1-5 0"/>',
  wallet: '<path d="M20 8H5a2 2 0 0 1 0-4h12v4 M3 6v12a2 2 0 0 0 2 2h15V8 M20 12h-5v4h5"/>',
  bag: '<path d="M4 8h16l-1 13H5z M9 9V6a3 3 0 0 1 6 0v3"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 19v-2a6 6 0 0 1 12 0v2 M16 4a4 4 0 0 1 0 8 M18 14a5 5 0 0 1 3 5"/>',
  cart: '<path d="M2 3h3l3 12h11l3-9H6 M9 19h.01 M18 19h.01"/><circle cx="9" cy="19" r="1"/><circle cx="18" cy="19" r="1"/>',
  trend: '<path d="m3 17 6-6 4 3 8-9 M16 5h5v5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4 M17 3v4 M3 10h18"/>',
  arr: '<path d="m9 6 6 6-6 6"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  leaf: '<path d="M19 3C11 2 4 5 4 12a7 7 0 0 0 7 7c8 0 9-9 8-16Z M3 21 15 9"/>',
  book: '<path d="M3 4c3-1 6 0 9 2 3-2 6-3 9-2v14c-3-1-6 0-9 2-3-2-6-3-9-2z M12 6v14"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  close: '<path d="m6 6 12 12 M18 6 6 18"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  plus: '<path d="M12 4v16 M4 12h16"/>',
  play: '<path d="m8 4 12 8-12 8z"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  shop: '<path d="m4 4-2 6c1 3 4 3 5 1 1 2 4 2 5 0 1 2 4 2 5 0 1 2 4 2 5-1l-2-6z M4 13v8h16v-8 M9 21v-7h6v7"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v14h5"/>',
  switch: '<path d="M3 8h17m-4-4 4 4-4 4M21 16H4m4-4-4 4 4 4"/>',
  star: '<path d="m12 3 2.7 5.7 6.3.9-4.5 4.5 1 6.4-5.5-3-5.5 3 1-6.4L3 9.6l6.3-.9z"/>',
  refresh: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  trash: '<path d="M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>'
};

const ic = (k, size = 19) =>
  '<svg aria-hidden="true" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
  (icons[k] || '') +
  '</svg>';
