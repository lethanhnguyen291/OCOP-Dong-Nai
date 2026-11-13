let page = 'overview',
  side = 'seller',
  period = 7,
  studioProduct = 'DN01',
  templateId = 0,
  query = '',
  category = '',
  channelFilter = '',
  statusFilter = '',
  toastTimer;

const main = document.querySelector('#main'),
  modal = document.querySelector('#modal'),
  screen = document.querySelector('#shell');

const go = key => {
  if (location.hash === '#' + key) route();
  else location.hash = key;
};

const btn = (s, act, cls = '', arg = '') =>
  '<button type="button" class="' + cls + '" data-act="' + act + '" data-id="' + esc(arg) + '">' + s + '</button>';

const options = (list, current) =>
  list
    .map(
      ([v, l]) =>
        '<option value="' + esc(v) + '" ' + (String(v) === String(current) ? 'selected' : '') + '>' + esc(l) + '</option>'
    )
    .join('');

function productPhoto(p) {
  if (Number.isInteger(p.pic)) return IMAGES[p.pic] || '';
  return typeof p.pic === 'string' && p.pic.startsWith('data:image/jpeg;base64,') ? p.pic : '';
}

function pic(p, cls = 'thumb') {
  const src = productPhoto(p);
  if (src) {
    return '<img class="' + cls + '" src="' + esc(src) + '" alt="' + esc(p.name) + '" loading="lazy">';
  }
  return '<span class="' + cls + ' photo-empty" role="img" aria-label="Sản phẩm chưa có ảnh">' + ic('box', 24) + '</span>';
}

const pselect = v => options(state.products.map(p => [p.id, p.name]), v);

const badge = p => '<span class="chip warm">' + ic('star', 12) + ' OCOP ' + p.stars + ' sao</span>';

const chanClass = c =>
  c === 'Shopee' ? 'chan-shopee' : c === 'TikTok Shop' ? 'chan-tiktok' : 'chan-lazada';

const chanPills = channels =>
  channels.length
    ? '<div class="chan-pills">' +
      channels.map(c => '<span class="chan-pill ' + chanClass(c) + '">' + esc(c) + '</span>').join('') +
      '</div>'
    : '<div class="chan-pills"><span class="chan-pill chan-none">Chưa chọn sàn</span></div>';

const rolelabel = () => (side === 'seller' ? 'Chủ cơ sở' : 'Đoàn viên');
const activeName = () => person(state.active)?.name || 'Đoàn viên';

function toast(txt) {
  const t = document.querySelector('#toast');
  t.textContent = txt;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3400);
}

function dialog(title, html) {
  document.querySelector('#modalContent').innerHTML =
    '<div class="spread dialoghead"><h2 id="dtitle">' +
    esc(title) +
    '</h2><button class="iconbtn plain" type="button" data-act="close" aria-label="Đóng">' +
    ic('close') +
    '</button></div>' +
    html;
  modal.setAttribute('aria-labelledby', 'dtitle');
  if (!modal.open) modal.showModal();
}

function topNav() {
  const pendingCount = state.orders.filter(o => o.status === 'pending' && o.id.startsWith('D')).length;
  const myLinksCount = state.links.filter(l => l.aid === state.active).length;

  const brand =
    '<span class="mark">' +
    ic('leaf', 26) +
    '</span><span><b>Nếp</b><small>OCOP Đồng Nai</small></span>';

  document.querySelector('#sidebar').innerHTML =
    '<a class="brand" href="#overview" aria-label="Nếp, trang tổng quan">' +
    brand +
    '</a>' +
    Object.entries(navs)
      .map(
        ([r, rows]) =>
          '<div class="navgroup"><div class="sidecap">' +
          (r === 'seller' ? 'Chủ cơ sở' : 'Đoàn viên') +
          '</div><nav class="nav" aria-label="' +
          (r === 'seller' ? 'Ứng dụng người bán' : 'Ứng dụng affiliate') +
          '">' +
          rows
            .map(([k, t, i]) => {
              const badgeHtml =
                k === 'overview' && pendingCount
                  ? '<span class="navbadge warn" title="Đơn thử chờ xác nhận">' + pendingCount + '</span>'
                  : k === 'links' && myLinksCount
                  ? '<span class="navbadge">' + myLinksCount + '</span>'
                  : '';
              return (
                '<a href="#' +
                k +
                '" ' +
                (page === k ? 'class="on" aria-current="page"' : '') +
                '>' +
                ic(i) +
                ' <span>' +
                t +
                '</span>' +
                badgeHtml +
                '</a>'
              );
            })
            .join('') +
          '</nav></div>'
      )
      .join('') +
    '<div class="sidefoot">' +
    btn(ic('book', 18) + ' Hồ sơ thí điểm', 'dossier', 'plain fullbtn') +
    btn(ic('refresh', 17) + ' Khôi phục dữ liệu mẫu', 'resetdemo', 'plain fullbtn mutedbtn') +
    '</div>';

  const isGuest = page === 'ref' || page === 'join';
  const identity = isGuest ? 'Khách trải nghiệm' : side === 'seller' ? 'Nhà vườn Đồng Nai' : activeName();

  const roleSwitcher =
    '<div class="roleswitch" role="group" aria-label="Chuyển nhanh vai trò">' +
    '<button type="button" class="rolebtn ' +
    (!isGuest && side === 'seller' ? 'active' : '') +
    '" data-act="switchseller">' +
    ic('shop', 15) +
    ' <span>Chủ cơ sở</span>' +
    (pendingCount ? '<span class="pillcount">' + pendingCount + '</span>' : '') +
    '</button>' +
    '<button type="button" class="rolebtn ' +
    (!isGuest && side === 'aff' ? 'active' : '') +
    '" data-act="switchaff">' +
    ic('users', 15) +
    ' <span>Đoàn viên</span></button>' +
    '</div>';

  document.querySelector('#top').innerHTML =
    '<div class="row">' +
    '<button type="button" class="iconbtn plain mobilemenu" data-act="menu" aria-label="Mở hoặc đóng điều hướng" aria-expanded="' +
    screen.classList.contains('menuopen') +
    '" aria-controls="sidebar">' +
    ic('menu') +
    '</button>' +
    '<b class="mobilebrand">Nếp</b>' +
    '<div class="crumb">' +
    ic(side === 'seller' ? 'shop' : 'compass', 16) +
    ' <span>' +
    (isGuest ? 'Trải nghiệm khách' : rolelabel()) +
    '</span> ' +
    ic('arr', 12) +
    ' <b>' +
    esc(titleByPage[page] || (page === 'plan' ? 'Kế hoạch 90 ngày' : page === 'deck' ? 'Pitch deck' : 'Trải nghiệm')) +
    '</b></div>' +
    '</div>' +
    '<div class="topactions">' +
    roleSwitcher +
    '<div class="topidentity">' +
    '<span class="avatar">' +
    ic(isGuest ? 'user' : side === 'seller' ? 'shop' : 'user', 16) +
    '</span>' +
    '<div><span class="identityname">' +
    esc(identity) +
    '</span><span class="role">' +
    (isGuest ? 'Bản thí điểm' : rolelabel()) +
    '</span></div>' +
    (side === 'aff' && !isGuest ? btn(ic('switch', 15) + ' Đổi', 'person', 'plain switchbtn') : '') +
    '</div>' +
    '</div>';
}

const head = (title, sub, act = '') =>
  '<div class="head pagehead"><div><h1>' + title + '</h1><p class="sub">' + sub + '</p></div><div class="row wrap">' + act + '</div></div>';

const periodControl = () =>
  '<label class="dater">' +
  ic('calendar', 16) +
  '<select id="period" aria-label="Khoảng thời gian">' +
  options(
    [
      [7, '7 ngày qua'],
      [30, '30 ngày qua']
    ],
    period
  ) +
  '</select></label>';

const metric = (ico, label, value, note) =>
  '<div class="metric"><div class="row"><span class="tile">' +
  ic(ico, 17) +
  '</span>' +
  label +
  '</div><strong>' +
  value +
  '</strong><small>' +
  note +
  '</small></div>';

function chart(series) {
  const v = series.map(group => group.value),
    cap = Math.max(1000000, Math.ceil(Math.max(...v) / 500000) * 500000),
    x = i => v.length === 1 ? 325 : 60 + i * (530 / (v.length - 1)),
    y = t => 166 - (t / cap) * 133;
  let pts = v.map((n, i) => x(i) + ',' + y(n)),
    path = 'M' + pts.join(' L');
  const axes = [0, 0.5, 1]
    .map(
      fr =>
        '<line x1="60" y1="' +
        y(fr * cap) +
        '" x2="590" y2="' +
        y(fr * cap) +
        '" stroke="#e3e8df" stroke-dasharray="4 5"/><text x="48" y="' +
        (y(fr * cap) + 4) +
        '" text-anchor="end">' +
        num((fr * cap) / 1e6) +
        '</text>'
    )
    .join('');
  const tickCount = Math.min(v.length, 7);
  const slots = Array.from({ length: tickCount }, (_, i) => Math.round(i * (v.length - 1) / Math.max(1, tickCount - 1)));
  return (
    '<svg class="chart" viewBox="0 0 610 201" role="img" aria-label="Doanh thu đơn hoàn tất trong kỳ, tính bằng triệu đồng"><defs><linearGradient id="wash" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#487b51" stop-opacity=".38"/><stop offset="100%" stop-color="#487b51" stop-opacity=".02"/></linearGradient></defs><g font-size="12" font-family="Segoe UI,Arial" fill="#52685a"><text x="9" y="15">Triệu ₫</text>' +
    axes +
    '<path d="' +
    path +
    ' L' + x(v.length - 1) + ',166 L' + x(0) + ',166 Z" fill="url(#wash)"/><path d="' +
    path +
    '" fill="none" stroke="#2d6a45" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
    v
      .map(
        (n, i) =>
          '<circle cx="' +
          x(i) +
          '" cy="' +
          y(n) +
          '" r="' +
          (v.length <= 7 ? 4.5 : 2.5) +
          '" fill="#fff" stroke="#2d6a45" stroke-width="2.2"><title>' +
          displayReportDate(series[i].from) + (series[i].from === series[i].to ? '' : ' – ' + displayReportDate(series[i].to)) +
          ': ' +
          money(n) +
          '</title></circle>'
      )
      .join('') +
    slots
      .map(
        i =>
          '<text x="' +
          x(i) +
          '" y="190" text-anchor="middle">' +
          series[i].from.slice(8) +
          '/' +
          series[i].from.slice(5, 7) +
          '</text>'
      )
      .join('') +
    '</g></svg>'
  );
}

function rankBy(rows, key) {
  const totals = new Map();
  rows.forEach(o => {
    const id = o[key];
    const r = totals.get(id) || { id, n: 0, v: 0, q: 0 };
    r.n++;
    r.q += o.qty;
    r.v += total(o);
    totals.set(id, r);
  });
  return [...totals.values()].sort((a, b) => b.v - a.v || a.id.localeCompare(b.id));
}

function overview() {
  const report = salesReport();
  const series = revenueSeries(report);
  const rangeLabel = displayReportDate(report.from) + ' – ' + displayReportDate(report.to);
  const done = report.done,
    prods = rankBy(done, 'pid'),
    crew = rankBy(done, 'aid'),
    p = product('DN01') || state.products[0];

  return (
    head('Tổng quan bán hàng', 'Đơn đặt từ ' + rangeLabel + ' · ' + esc(reportChannel || 'Tất cả sàn'), reportControls()) +
    pendingBox() +
    '<section class="hero"><div class="heroCopy"><div class="herotag">Góc thực hành · Chủ cơ sở & Đoàn viên</div><h2>Video đầu tiên của nhà vườn</h2><p class="caption">Chỉ cần điện thoại và 4 cảnh quay ngắn để giới thiệu đặc sản OCOP Đồng Nai lên Shopee, TikTok Shop và Lazada.</p><div class="heroActions">' +
    btn(ic('play', 13) + ' Mở mẫu quay 30 giây', 'startstudio', 'herobtn') +
    btn(ic('compass', 14) + ' Thử vai trò Đoàn viên', 'discover', 'herobtn ghost') +
    '</div></div><div class="heroMedia" style="background-image:url(' +
    esc(productPhoto(p) || IMAGES[0]) +
    ')"><span class="photocap">Xoài Đồng Nai · Ảnh minh họa</span></div></section>' +
    '<div class="metrics">' +
    metric('wallet', 'Doanh thu', money(sum(done, total)), 'Từ ' + num(done.length) + ' đơn hoàn tất trong kỳ') +
    metric('bag', 'Đơn hoàn tất', num(done.length), esc(reportChannel || 'Trên cả ba sàn')) +
    metric('users', 'Hoa hồng đoàn viên', money(sum(done, commission)), 'Từ các đơn giới thiệu hoàn tất') +
    '</div>' +
    '<div class="cols"><section class="card"><div class="cardhead"><h2>' +
    (series[0].from === series[0].to ? 'Doanh thu theo ngày' : 'Doanh thu theo nhóm ngày') +
    '</h2><span class="key">Đơn hoàn tất</span></div>' +
    chart(series) +
    '</section><section class="card"><div class="cardhead"><h2>Sản phẩm bán chạy</h2><small>Theo doanh thu</small></div>' +
    (!done.length ? '<p class="help">Chưa có đơn hoàn tất trong phạm vi đã chọn.</p>' : '') +
    prods
      .slice(0, 4)
      .map((a, i) => {
        let p = product(a.id);
        return (
          '<div class="rank"><span class="ranknum">0' +
          (i + 1) +
          '</span>' +
          pic(p) +
          '<div><b>' +
          esc(p.name) +
          '</b><small>' +
          a.q +
          ' sản phẩm · ' +
          esc(p.origin) +
          '</small></div><span class="value">' +
          money(a.v) +
          '</span></div>'
        );
      })
      .join('') +
    '</section></div>' +
    channelBreakdown(report) +
    '<section class="card sectiongap"><div class="cardhead"><h2>Đoàn viên nổi bật</h2>' +
    btn(ic('plus', 15) + ' Mời đoàn viên', 'invite', 'inline') +
    '</div><div class="twrap"><table><thead><tr><th>Đoàn viên</th><th class="r">Đơn hoàn tất</th><th class="r">Doanh thu giới thiệu</th><th class="r">Hoa hồng</th></tr></thead><tbody>' +
    (!done.length ? '<tr><td colspan="4">Chưa có đơn giới thiệu hoàn tất trong kỳ.</td></tr>' : '') +
    crew
      .slice(0, 5)
      .map(
        a =>
          '<tr><td><div class="person"><span class="avatar">' +
          esc(
            (person(a.id)?.name || 'ĐV')
              .split(' ')
              .map(s => s[0])
              .slice(-2)
              .join('')
          ) +
          '</span><div><b>' +
          esc(person(a.id)?.name || a.id) +
          '</b></div></div></td><td class="r">' +
          a.n +
          '</td><td class="r">' +
          money(a.v) +
          '</td><td class="r"><b class="pine-text">' +
          money(sum(done.filter(o => o.aid === a.id), commission)) +
          '</b></td></tr>'
      )
      .join('') +
    '</tbody></table></div></section>'
  );
}

function visibleProducts() {
  const clean = s =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase();
  return state.products.filter(
    p =>
      (side === 'seller' || p.channels.length) &&
      (!channelFilter || p.channels.includes(channelFilter)) &&
      (!category || p.group === category) &&
      clean([p.name, p.origin, p.id].join(' ')).includes(clean(query.trim()))
  );
}

function productsGrid() {
  const rows = visibleProducts(),
    aff = side === 'aff';
  return (
    '<div class="spread countbar"><p class="count">Hiển thị <b>' +
    rows.length +
    '</b> sản phẩm · Ảnh và xếp hạng minh họa</p>' +
    (query || category || channelFilter ? btn('Xóa bộ lọc', 'clear', 'inline') : '') +
    '</div><div class="grid">' +
    rows
      .map(
        p =>
          '<article class="prod"><div class="photo-wrap">' +
          pic(p, 'photo') +
          '<span class="cat-pill">' +
          esc(p.group) +
          '</span></div><div class="prodtext"><div class="spread">' +
          badge(p) +
          '<span class="meta">' +
          ic('pin', 12) +
          ' ' +
          esc(p.origin) +
          '</span></div><h2 class="pname">' +
          esc(p.name) +
          '</h2><p class="meta prod-desc">' +
          esc(p.desc || '') +
          '</p><div class="spread meta-row"><span>Quy cách: <b>' +
          esc(p.pack) +
          '</b></span>' +
          (aff
            ? '<span class="comm-badge">Hoa hồng ' + p.rate + '% (' + money(Math.round((p.price * p.rate) / 100)) + ')</span>'
            : '<span>Hoa hồng: <b>' + p.rate + '%</b></span>') +
          '</div>' +
          chanPills(p.channels) +
          '<div class="prodfoot"><b class="price">' +
          money(p.price) +
          '</b>' +
          btn(
            aff ? 'Giới thiệu ' + ic('arrow', 14) : 'Quản lý ' + ic('arr', 13),
            aff ? 'offer' : 'edit',
            aff ? 'primary' : '',
            p.id
          ) +
          '</div></div></article>'
      )
      .join('') +
    '</div>' +
    (!rows.length
      ? '<div class="empty"><h3>Chưa có sản phẩm phù hợp</h3><p>Hãy thử từ khóa khác hoặc xóa bộ lọc đang chọn.</p>' +
        btn('Xóa bộ lọc', 'clear', 'primary') +
        '</div>'
      : '')
  );
}

function catalog() {
  const aff = side === 'aff';
  return (
    head(
      aff ? 'Khám phá sản phẩm' : 'Sản phẩm & sàn',
      aff
        ? 'Chọn đặc sản Đồng Nai, xem hoa hồng và tạo liên kết giới thiệu.'
        : 'Quản lý thông tin sản phẩm và đường dẫn bán trên từng sàn.',
      aff ? '' : btn(ic('plus', 17) + ' Thêm sản phẩm', 'add', 'primary')
    ) +
    '<div class="filters"><label class="search">' +
    ic('search', 18) +
    '<input id="q" aria-label="Tìm sản phẩm" placeholder="Tìm sản phẩm, vùng trồng, mã DN…" value="' +
    esc(query) +
    '"></label><select id="category" aria-label="Nhóm sản phẩm">' +
    options([['', 'Tất cả nhóm'], ...['Trái cây', 'Hạt & đồ khô', 'Đồ uống'].map(s => [s, s])], category) +
    '</select><select id="channelFilter" aria-label="Lọc theo sàn">' +
    options([['', 'Tất cả sàn'], ...CHANNELS.map(s => [s, s])], channelFilter) +
    '</select></div><div id="productResults">' +
    productsGrid() +
    '</div>'
  );
}

function studio() {
  const p = product(studioProduct) || state.products[0],
    t = TEMPLATES[templateId],
    s = state.shots[p.id + '/' + templateId] || [],
    doneCount = s.filter(Boolean).length;
  return (
    head('Hướng dẫn quay video', 'Chọn sản phẩm và mẫu kịch bản để quay từng cảnh bằng điện thoại.') +
    '<div class="studio"><section class="card stack">' +
    pic(p, 'photo') +
    '<div class="spread">' +
    badge(p) +
    '<small>' +
    esc(p.origin) +
    ' · ' +
    esc(p.pack) +
    '</small></div>' +
    '<label class="field"><span>Sản phẩm</span><select id="studioProduct">' +
    pselect(p.id) +
    '</select></label><label class="field"><span>Mẫu quay</span><select id="templateId">' +
    options(
      TEMPLATES.map((t, i) => [i, t.name + ' · ' + t.duration + ' giây']),
      templateId
    ) +
    '</select></label><div class="offer"><strong>Trước khi quay</strong><p class="help">Lau ống kính, dựng máy dọc 9:16 và đặt sản phẩm gần cửa sổ. Quay thử 3 giây để nghe lại tiếng.</p></div></section><section class="card"><div class="cardhead"><h2>' +
    t.name +
    '</h2><span class="chip">' +
    ic('video', 13) +
    ' ' +
    t.duration +
    ' giây</span></div><div class="spread"><small>Đánh dấu các cảnh đã quay cho <b>' +
    esc(p.name) +
    '</b></small><b class="pine-text">' +
    doneCount +
    '/4 cảnh hoàn thành</b></div><div class="progress"><i style="width:' +
    doneCount * 25 +
    '%"></i></div>' +
    t.shots
      .map(
        ([time, name, tip, voice], i) =>
          '<label class="scene ' +
          (s[i] ? 'done' : '') +
          '"><input type="checkbox" data-shot="' +
          i +
          '" ' +
          (s[i] ? 'checked' : '') +
          '><span><span class="time">Cảnh ' +
          (i + 1) +
          ' · ' +
          time +
          '</span><strong>' +
          name +
          '</strong><span class="help">' +
          esc(tplText(tip, p)) +
          '</span><em>“' +
          esc(tplText(voice, p)) +
          '”</em></span></label>'
      )
      .join('') +
    '<div class="actions">' +
    (doneCount ? btn(ic('refresh', 15) + ' Đặt lại cảnh quay', 'resetshots') : '') +
    btn(ic('copy', 15) + ' Sao chép kịch bản', 'script', 'primary') +
    '</div></section></div>'
  );
}

const linkFor = l =>
  location.href.split('#')[0] + '#r/' + [l.pid, l.aid, CHANNELS.indexOf(l.channel)].map(encodeURIComponent).join('/');
const linkCode = l => [l.pid, l.aid, CHANNELS.indexOf(l.channel)].join('/');

function links() {
  const rows = state.links.filter(l => l.aid === state.active);
  return (
    head(
      'Liên kết của tôi',
      'Mỗi liên kết ghi nhận người giới thiệu (' + esc(activeName()) + '), sản phẩm và sàn đã chọn.',
      btn(ic('plus', 16) + ' Tạo liên kết', 'discover', 'primary')
    ) +
    '<div class="notice">Bản thử lưu đơn trên thiết bị này. Khi trình diễn, mở liên kết trong cùng trình duyệt để tạo đơn thử và đối soát.</div>' +
    (rows.length
      ? '<div class="stack sectiongap">' +
        rows
          .map(l => {
            const p = product(l.pid);
            if (!p) return '';
            const code = linkCode(l);
            const orderCount = state.orders.filter(
              o => o.pid === l.pid && o.aid === l.aid && o.channel === l.channel && o.id.startsWith('D')
            ).length;
            return (
              '<section class="card linkcard"><div class="spread wrap"><div class="tableitem">' +
              pic(p) +
              '<div><div class="row wrap"><h3 class="linktitle">' +
              esc(p.name) +
              '</h3><span class="chan-pill ' +
              chanClass(l.channel) +
              '">' +
              esc(l.channel) +
              '</span></div><small>Giá: ' +
              money(p.price) +
              ' · Hoa hồng: <b>' +
              money(Math.round((p.price * p.rate) / 100)) +
              '/phần</b> (' +
              p.rate +
              '%) · Mã: <code>' +
              esc(code) +
              '</code>' +
              (orderCount ? ' · <b>' + orderCount + ' đơn thử</b>' : '') +
              '</small></div></div><div class="row wrap">' +
              btn('Mở thử ' + ic('arr', 14), 'testlink', '', code) +
              btn(ic('copy', 15) + ' Sao chép', 'copylink', 'primary', code) +
              btn(ic('trash', 15), 'deletelink', 'iconbtn plain', code) +
              '</div></div></section>'
            );
          })
          .join('') +
        '</div>'
      : '<div class="empty sectiongap"><h3>Bạn chưa có liên kết giới thiệu</h3><p>Chọn một sản phẩm đặc sản Đồng Nai và sàn thương mại điện tử để nhận liên kết đầu tiên.</p>' +
        btn(ic('compass', 16) + ' Khám phá sản phẩm', 'discover', 'primary') +
        '</div>')
  );
}

const statusName = s => ({ done: 'Hoàn tất', pending: 'Chờ xác nhận', cancel: 'Đã hủy' }[s] || s);

function income() {
  const all = periodOrders(period).filter(o => o.aid === state.active),
    done = all.filter(o => o.status === 'done'),
    waiting = all.filter(o => o.status === 'pending'),
    rows = all
      .filter(o => !statusFilter || o.status === statusFilter)
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  return (
    head('Đơn & hoa hồng', 'Kết quả giới thiệu của đoàn viên ' + esc(activeName()) + '.', periodControl()) +
    '<div class="metrics">' +
    metric('wallet', 'Hoa hồng đã ghi nhận', money(sum(done, commission)), 'Từ ' + num(done.length) + ' đơn đã hoàn tất') +
    metric('calendar', 'Hoa hồng dự kiến', money(sum(waiting, commission)), 'Từ ' + num(waiting.length) + ' đơn chờ xác nhận') +
    metric('bag', 'Đơn hoàn tất', num(done.length), 'Trong ' + period + ' ngày đã chọn') +
    '</div><section class="card"><div class="cardhead wrap"><h2>Đơn được giới thiệu</h2><select id="statusFilter" aria-label="Trạng thái đơn">' +
    options(
      [
        ['', 'Mọi trạng thái'],
        ['pending', 'Chờ xác nhận'],
        ['done', 'Hoàn tất'],
        ['cancel', 'Đã hủy']
      ],
      statusFilter
    ) +
    '</select></div><div class="twrap"><table><thead><tr><th>Sản phẩm / ngày</th><th>Sàn</th><th>Trạng thái</th><th class="r">Giá trị đơn</th><th class="r">Hoa hồng</th></tr></thead><tbody>' +
    rows
      .map(
        o =>
          '<tr><td><b>' +
          esc(product(o.pid)?.name || o.pid) +
          '</b><br><small>' +
          esc(o.date.split('-').reverse().join('/')) +
          ' · ' +
          o.qty +
          ' phần' +
          (o.id.startsWith('D') ? ' · <span class="test-tag">Đơn thử</span>' : '') +
          '</small></td><td><span class="chan-pill ' +
          chanClass(o.channel) +
          '">' +
          esc(o.channel) +
          '</span></td><td><span class="status ' +
          o.status +
          '">' +
          statusName(o.status) +
          '</span></td><td class="r">' +
          money(total(o)) +
          '</td><td class="r"><b>' +
          money(o.status === 'cancel' ? 0 : commission(o)) +
          '</b></td></tr>'
      )
      .join('') +
    '</tbody></table>' +
    (!rows.length ? '<div class="empty">Chưa có đơn trong kỳ và trạng thái đã chọn.</div>' : '') +
    '</div></section>'
  );
}
