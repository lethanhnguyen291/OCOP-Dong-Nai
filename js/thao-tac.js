const field = (label, control, wide = '') =>
  '<label class="field ' + wide + '"><span>' + label + '</span>' + control + '</label>';

function photoField(p) {
  const src = productPhoto(p);
  return (
    '<div class="full"><span class="label">Ảnh sản phẩm</span>' +
    '<div class="photo-upload-row"><img id="photoPreview" class="upload-preview" alt="Ảnh xem trước" ' +
    (src ? 'src="' + esc(src) + '"' : 'hidden') +
    '>' +
    '<div><label class="button photo-picker">' +
    ic('plus', 16) +
    ' Tải ảnh lên' +
    '<input name="productPhoto" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Tải ảnh lên" aria-describedby="photoTypes"></label>' +
    '<p id="photoTypes" class="help">JPG, PNG hoặc WebP</p></div></div>' +
    '<p id="photoStatus" class="help" aria-live="polite"></p></div>'
  );
}

async function prepareProductPhoto(file) {
  if (file.type && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Vui lòng chọn ảnh JPG, PNG hoặc WebP.');
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const scale = Math.min(1, 960 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch {
    throw new Error('Không đọc được ảnh. Hãy chọn một ảnh JPG, PNG hoặc WebP khác.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function previewProductPhoto(input) {
  const form = input.form;
  const file = input.files[0];
  const preview = form.querySelector('#photoPreview');
  const status = form.querySelector('#photoStatus');
  const save = form.querySelector('[type="submit"]');
  if (!file) {
    const current = product(form.elements.pid.value);
    const src = current && productPhoto(current);
    if (src) preview.src = src;
    else preview.removeAttribute('src');
    preview.hidden = !src;
    input.setCustomValidity('');
    status.textContent = '';
    save.disabled = false;
    return;
  }

  input.setCustomValidity('Đang chuẩn bị ảnh.');
  status.textContent = 'Đang chuẩn bị ảnh…';
  save.disabled = true;
  try {
    const src = await prepareProductPhoto(file);
    if (input.files[0] !== file) return;
    preview.src = src;
    preview.hidden = false;
    input.setCustomValidity('');
    status.textContent = file.name;
  } catch (error) {
    if (input.files[0] !== file) return;
    input.value = '';
    await previewProductPhoto(input);
    status.textContent = error.message;
  } finally {
    if (input.files[0] === file) save.disabled = false;
  }
}

function editor(id) {
  const p = product(id) || {
    name: '',
    origin: '',
    pack: '',
    price: '',
    rate: 10,
    stars: 3,
    group: 'Trái cây',
    desc: '',
    urls: {},
    channels: [],
    pic: null
  };
  dialog(
    id ? 'Quản lý sản phẩm' : 'Thêm sản phẩm',
    '<form id="editform" class="stack"><input type="hidden" name="pid" value="' +
      esc(id) +
      '"><div class="formgrid">' +
      field('Tên sản phẩm', '<input name="name" required maxlength="70" value="' + esc(p.name) + '">', 'full') +
      field('Vùng sản xuất', '<input name="origin" required maxlength="50" value="' + esc(p.origin) + '">') +
      field(
        'Quy cách',
        '<input name="pack" required maxlength="50" placeholder="Ví dụ: Túi 200 g" value="' + esc(p.pack) + '">'
      ) +
      field(
        'Giá bán (đồng)',
        '<input type="number" name="price" min="1000" max="99999999" step="1" required value="' + p.price + '">'
      ) +
      field(
        'Hoa hồng mỗi đơn (%)',
        '<input type="number" name="rate" min="0" max="100" step="0.1" required value="' + p.rate + '">'
      ) +
      field(
        'Nhóm sản phẩm',
        '<select name="group">' + options(['Trái cây', 'Hạt & đồ khô', 'Đồ uống'].map(s => [s, s]), p.group) + '</select>'
      ) +
      field(
        'Hạng OCOP minh họa',
        '<select name="stars">' +
          options(
            [
              [3, '3 sao'],
              [4, '4 sao']
            ],
            p.stars
          ) +
          '</select>'
      ) +
      field('Mô tả ngắn', '<textarea name="desc" maxlength="350" rows="2">' + esc(p.desc) + '</textarea>', 'full') +
      photoField(p) +
      '</div><h3>Sàn phân phối</h3><p class="help">Chọn sàn để mở giới thiệu trong demo. Nếu đã đăng bán, dán đường dẫn sản phẩm thật để khách mở gian hàng.</p>' +
      CHANNELS.map(
        (c, i) =>
          '<div class="channelRow"><label><input type="checkbox" data-channel="' +
          i +
          '" name="c' +
          i +
          '" ' +
          (p.channels.includes(c) ? 'checked' : '') +
          '>' +
          c +
          '</label><input type="url" name="url' +
          i +
          '" aria-label="Đường dẫn sản phẩm ' +
          c +
          '" placeholder="Đường dẫn sản phẩm ' +
          c +
          ' (tùy chọn)" value="' +
          esc(p.urls[c] || '') +
          '" ' +
          (p.channels.includes(c) ? '' : 'disabled') +
          '></div>'
      ).join('') +
      '<p class="error" role="alert"></p><div class="actions">' +
      btn('Đóng', 'close') +
      '<button class="primary" type="submit">Lưu sản phẩm</button></div></form>'
  );
}

function offer(id) {
  const p = product(id);
  if (!p || !p.channels.length) {
    toast('Sản phẩm chưa mở giới thiệu.');
    return;
  }
  dialog(
    p.name,
    '<div class="stack">' +
      pic(p, 'detailpic') +
      '<div class="spread">' +
      badge(p) +
      '<small>' +
      esc(p.origin) +
      ' · ' +
      esc(p.pack) +
      '</small></div><p>' +
      esc(p.desc) +
      '</p><div class="offer"><strong>' +
      money(Math.round((p.price * p.rate) / 100)) +
      ' / phần</strong><p class="help">Hoa hồng ' +
      p.rate +
      '% trên giá bán ' +
      money(p.price) +
      '. Chỉ ghi nhận khi đơn hoàn tất.</p></div><form id="offerform" class="stack"><input type="hidden" name="pid" value="' +
      esc(p.id) +
      '">' +
      field('Sàn muốn giới thiệu', '<select name="channel">' + options(p.channels.map(s => [s, s]), p.channels[0]) + '</select>') +
      '<button type="submit" class="primary">' +
      ic('link', 16) +
      ' Tạo liên kết của tôi</button></form></div>'
  );
}

function infoBox() {
  dialog(
    'Hồ sơ thí điểm',
    '<div class="stack"><p>Bộ hồ sơ “OCOP Đồng Nai lên sàn” dùng để trình bày ngày 16/11/2026.</p><div class="offer"><b>Thử trọn một đơn</b><p class="help">Vào Khám phá sản phẩm, chọn Giới thiệu rồi tạo liên kết. Mở thử, đặt một đơn và quay lại Tổng quan để xác nhận. Mở Đơn & hoa hồng của cùng đoàn viên để xem kết quả.</p></div><div class="row wrap">' +
      btn(ic('book') + ' Xem kế hoạch 90 ngày', 'plan') +
      btn(ic('play') + ' Mở pitch deck 10 slide', 'deck', 'primary') +
      '</div><div class="row wrap"><a href="ho-so/Mockup-6-man-hinh.pdf" class="button" target="_blank" rel="noopener">Mở bộ mockup PDF</a><a href="ho-so/Ke-hoach-90-ngay.pdf" class="button" target="_blank" rel="noopener">Mở kế hoạch PDF</a></div><p class="help">10 sản phẩm, hạng sao, giá, danh tính và đơn hàng đều là ví dụ. Trước khi bán thật, cần kiểm tra chứng nhận, lấy đường dẫn của chủ cơ sở và đối soát dữ liệu đơn từ sàn. Ảnh sản phẩm là ảnh minh họa tạo bằng AI.</p><div class="actions">' +
      btn(ic('refresh', 15) + ' Khôi phục dữ liệu mẫu', 'resetdemo') +
      btn('Đóng', 'close') +
      '</div></div>'
  );
}

function invite() {
  const url = location.href.split('#')[0] + '#join';
  dialog(
    'Mời đoàn viên',
    '<div class="stack"><p>Gửi lời mời để đoàn viên đăng ký tên hiển thị và chọn sản phẩm đầu tiên.</p>' +
      field('Liên kết mời', '<input id="shareText" readonly class="copyfield" value="' + esc(url) + '">') +
      '<p class="help">Để trình diễn với cùng dữ liệu, hãy mở lời mời trong trình duyệt đang dùng.</p><div class="actions">' +
      btn('Mở lời mời', 'join') +
      btn(ic('copy', 15) + ' Sao chép lời mời', 'copyinvite', 'primary') +
      '</div></div>'
  );
}

function joinPage() {
  return (
    '<section class="card customer stack"><span class="chip">' +
    ic('users', 14) +
    ' Lời mời đoàn viên</span><h1>Tham gia giới thiệu đặc sản</h1><p class="sub">Chọn sản phẩm, tạo liên kết cá nhân và theo dõi hoa hồng theo từng đơn. Tài khoản trải nghiệm được lưu trên trình duyệt này.</p><form id="joinform" class="stack">' +
    field('Tên hiển thị', '<input name="display" required maxlength="40" autocomplete="given-name" placeholder="Nhập tên của bạn">') +
    '<p class="error" role="alert"></p><button type="submit" class="primary">Tham gia và chọn sản phẩm ' +
    ic('arrow', 16) +
    '</button></form></section>'
  );
}

function refPage() {
  const [, pid, aid, ci] = location.hash.slice(1).split('/'),
    p = product(pid),
    a = person(aid),
    chan = CHANNELS[Number(ci)];
  if (!p || !a || !chan || !p.channels.includes(chan)) {
    return (
      '<section class="empty"><h2>Liên kết chưa khả dụng</h2><p>Sản phẩm, sàn hoặc người giới thiệu chưa có trên thiết bị này.</p>' +
      btn('Về danh mục', 'discover', 'primary') +
      '</section>'
    );
  }
  const url = shopUrl(p.urls[chan], chan);
  const unitComm = Math.round((p.price * p.rate) / 100);
  return (
    '<section class="card customer stack">' +
    pic(p, 'detailpic') +
    '<div class="spread">' +
    badge(p) +
    '<small>' +
    ic('pin', 12) +
    ' ' +
    esc(p.origin) +
    '</small></div><h1>' +
    esc(p.name) +
    '</h1><p>' +
    esc(p.desc) +
    '</p><div class="spread"><b class="price">' +
    money(p.price) +
    '</b><span class="chip">' +
    esc(p.pack) +
    '</span></div><div class="offer"><b>' +
    esc(a.name) +
    ' giới thiệu</b><p class="help">Kênh ' +
    esc(chan) +
    ' · Hoa hồng đoàn viên: ' +
    p.rate +
    '% (' +
    money(unitComm) +
    '/phần)</p></div>' +
    (url
      ? '<a class="button" target="_blank" rel="noopener noreferrer" href="' +
        esc(url) +
        '">Mở sản phẩm trên ' +
        esc(chan) +
        ' ' +
        ic('arrow', 15) +
        '</a>'
      : '') +
    '<form id="orderform" class="stack"><input type="hidden" name="pid" value="' +
    p.id +
    '"><input type="hidden" name="aid" value="' +
    a.id +
    '"><input type="hidden" name="channel" value="' +
    esc(chan) +
    '"><input type="hidden" name="oid" value="' +
    newId('D') +
    '">' +
    field('Số lượng', '<input type="number" id="qty" name="qty" value="1" min="1" max="99" step="1" required>') +
    '<div class="order-summary"><div class="spread"><span>Thành tiền</span><b id="subtotal" class="price">' +
    money(p.price) +
    '</b></div><div class="spread"><small>Hoa hồng dự kiến (' +
    p.rate +
    '%)</small><small id="estcomm"><b>' +
    money(unitComm) +
    '</b></small></div></div><p class="help">Đơn thử sẽ chờ chủ cơ sở xác nhận. Thao tác này không thanh toán hoặc gửi đơn lên sàn.</p><button type="submit" class="primary">Tạo đơn thử</button></form></section>'
  );
}

function newId(prefix) {
  return (
    prefix +
    (crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2))
      .replaceAll('-', '')
      .slice(0, 14)
  );
}

function pendingBox() {
  const rows = state.orders.filter(o => o.status === 'pending' && o.id.startsWith('D'));
  if (!rows.length) return '';
  return (
    '<section id="pendingOrders" class="card pending-alert sectiongap"><div class="cardhead"><div><span class="chip warm">Cần xác nhận</span><h2>Đơn thử chờ xử lý</h2></div><small><b>' +
    rows.length +
    ' đơn mới</b></small></div>' +
    rows
      .map(
        o =>
          '<div class="rank wrap">' +
          pic(product(o.pid)) +
          '<div><b>' +
          esc(product(o.pid)?.name) +
          ' × ' +
          o.qty +
          '</b><small>Đoàn viên: <b>' +
          esc(person(o.aid)?.name) +
          '</b> · ' +
          esc(o.channel) +
          ' · Đơn: <b>' +
          money(total(o)) +
          '</b> (Hoa hồng: ' +
          money(commission(o)) +
          ')</small></div><div class="row wrap">' +
          btn('Hủy đơn', 'cancelorder', '', o.id) +
          btn(ic('check', 15) + ' Xác nhận hoàn tất', 'doneorder', 'primary', o.id) +
          '</div></div>'
      )
      .join('') +
    '</section>'
  );
}

function route() {
  if (modal.open) modal.close();
  screen.classList.remove('menuopen');
  const old = page;
  let key = location.hash.slice(1) || 'overview';
  page = key.startsWith('r/') ? 'ref' : key;
  if (!['ref', 'join', 'plan', 'deck', ...Object.keys(titleByPage)].includes(page)) {
    page = 'overview';
  }
  side = navs.aff.some(n => n[0] === page) || page === 'join' ? 'aff' : 'seller';
  if (page !== old) {
    query = '';
    category = '';
    channelFilter = '';
    statusFilter = '';
  }
  paint();
  window.scrollTo(0, 0);
}

function paint() {
  topNav();
  const views = {
    overview,
    products: catalog,
    discover: catalog,
    studio,
    links,
    income,
    join: joinPage,
    ref: refPage,
    plan: planView,
    deck: deckView
  };
  main.innerHTML = views[page]();
  document.title =
    (titleByPage[page] ||
      {
        ref: 'Sản phẩm giới thiệu',
        join: 'Mời đoàn viên',
        plan: 'Kế hoạch 90 ngày',
        deck: 'Pitch deck'
      }[page]) + ' · Nếp OCOP';
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Đã sao chép vào bộ nhớ tạm.');
  } catch (e) {
    dialog(
      'Sao chép nội dung',
      '<p class="help">Chọn và sao chép nội dung dưới đây.</p><textarea id="manualcopy" rows="5" readonly>' +
        esc(text) +
        '</textarea>'
    );
    document.querySelector('#manualcopy').select();
  }
}

function filters() {
  document.querySelector('#productResults').innerHTML = productsGrid();
}

async function takeAction(act, id) {
  if (['discover', 'join', 'plan', 'deck', 'overview', 'links', 'income'].includes(act)) {
    go(act);
    return;
  }
  if (act === 'switchseller') {
    go('overview');
    toast('Đã chuyển sang giao diện Chủ cơ sở.');
    return;
  }
  if (act === 'switchaff') {
    go('discover');
    toast('Đã chuyển sang giao diện Đoàn viên (' + activeName() + ').');
    return;
  }
  if (act === 'close') {
    modal.close();
    return;
  }
  if (act === 'menu') {
    screen.classList.toggle('menuopen');
    topNav();
    return;
  }
  if (act === 'revieworder') {
    go('overview');
    requestAnimationFrame(() => document.getElementById('pendingOrders')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    return;
  }
  if (act === 'dossier') {
    infoBox();
    return;
  }
  if (act === 'resetdemo') {
    dialog(
      'Khôi phục dữ liệu mẫu',
      '<div class="stack"><p>Bạn có muốn đặt lại toàn bộ sản phẩm, đơn thử, liên kết và tiến độ quay về trạng thái ban đầu để bắt đầu lượt trình diễn mới?</p><div class="actions">' +
        btn('Hủy', 'close') +
        btn(ic('refresh', 15) + ' Khôi phục ngay', 'confirmreset', 'primary') +
        '</div></div>'
    );
    return;
  }
  if (act === 'confirmreset') {
    resetDemoState();
    modal.close();
    query = category = channelFilter = statusFilter = '';
    go('overview');
    paint();
    toast('Đã khôi phục dữ liệu mẫu ban đầu.');
    return;
  }
  if (act === 'startstudio') {
    studioProduct = 'DN01';
    templateId = 0;
    go('studio');
    return;
  }
  if (act === 'resetshots') {
    const key = studioProduct + '/' + templateId;
    if (await change(s => { delete s.shots[key]; })) {
      paint();
      toast('Đã đặt lại tiến độ cảnh quay.');
    }
    return;
  }
  if (act === 'clear') {
    query = category = channelFilter = '';
    paint();
    return;
  }
  if (act === 'add' || act === 'edit') {
    editor(id);
    return;
  }
  if (act === 'offer') {
    offer(id);
    return;
  }
  if (act === 'invite') {
    invite();
    return;
  }
  if (act === 'copyinvite') {
    await copy(document.querySelector('#shareText').value);
    return;
  }
  if (act === 'person') {
    dialog(
      'Chọn đoàn viên',
      '<div class="stack">' +
        field('Tài khoản trải nghiệm', '<select id="who">' + options(state.people.map(a => [a.id, a.name]), state.active) + '</select>') +
        '<div class="actions">' +
        btn('Mở lời mời mới', 'join') +
        btn('Dùng tài khoản này', 'useperson', 'primary') +
        '</div></div>'
    );
    return;
  }
  if (act === 'useperson') {
    const who = document.querySelector('#who').value;
    if (
      await change(s => {
        if (s.people.some(a => a.id === who)) s.active = who;
      })
    ) {
      modal.close();
      paint();
      toast('Đang dùng tài khoản đoàn viên ' + activeName() + '.');
    }
    return;
  }
  if (act === 'script') {
    const p = product(studioProduct),
      t = TEMPLATES[templateId];
    await copy(
      [
        p.name + ' – ' + t.name,
        ...t.shots.map(([time, name, tip, voice]) => time + ' · ' + name + '\n' + tplText(tip, p) + '\n“' + tplText(voice, p) + '”')
      ].join('\n\n')
    );
    return;
  }
  if (act === 'copylink' || act === 'testlink') {
    const l = state.links.find(x => linkCode(x) === id);
    if (l) {
      if (act === 'copylink') await copy(linkFor(l));
      else go('r/' + id);
    }
    return;
  }
  if (act === 'deletelink') {
    if (
      await change(s => {
        s.links = s.links.filter(x => linkCode(x) !== id);
      })
    ) {
      paint();
      toast('Đã xóa liên kết giới thiệu.');
    }
    return;
  }
  if (act === 'doneorder' || act === 'cancelorder') {
    const target = act === 'doneorder' ? 'done' : 'cancel';
    if (
      await change(s => {
        const o = s.orders.find(o => o.id === id && o.status === 'pending');
        if (o) o.status = target;
      })
    ) {
      paint();
      toast(target === 'done' ? 'Đã ghi nhận doanh thu và hoa hồng.' : 'Đã hủy đơn thử.');
    }
    return;
  }
  if (act === 'deckprev' || act === 'decknext') {
    slideIndex = Math.max(0, Math.min(9, slideIndex + (act === 'decknext' ? 1 : -1)));
    paint();
    return;
  }
  if (act === 'gotoslide') {
    const idx = Number(id);
    if (Number.isInteger(idx) && idx >= 0 && idx <= 9) {
      slideIndex = idx;
      paint();
    }
    return;
  }
  if (act === 'print') {
    window.print();
    return;
  }
  if (act === 'downloadDeck') {
    downloadDeck();
    return;
  }
}

document.addEventListener('click', event => {
  const b = event.target.closest('[data-act]');
  if (b) {
    takeAction(b.dataset.act, b.dataset.id);
  } else if (screen.classList.contains('menuopen') && !event.target.closest('#sidebar')) {
    screen.classList.remove('menuopen');
    topNav();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'q') {
    query = e.target.value;
    filters();
  }
  if (e.target.id === 'qty') {
    const p = product(document.querySelector('#orderform [name=pid]').value);
    const valid = e.target.validity.valid;
    const q = Number(e.target.value);
    document.querySelector('#subtotal').textContent = valid ? money(p.price * q) : '—';
    const estEl = document.querySelector('#estcomm');
    if (estEl) {
      estEl.innerHTML = valid ? '<b>' + money(Math.round((p.price * q * p.rate) / 100)) + '</b>' : '—';
    }
  }
});

document.addEventListener('change', async e => {
  const t = e.target;
  if (t.name === 'productPhoto' && t.form?.id === 'editform') {
    await previewProductPhoto(t);
    return;
  }
  if (t.dataset.channel !== undefined) {
    t.form.elements['url' + t.dataset.channel].disabled = !t.checked;
    return;
  }
  if (t.dataset.shot !== undefined) {
    const i = Number(t.dataset.shot),
      checked = t.checked,
      key = studioProduct + '/' + templateId;
    if (
      await change(s => {
        const items = s.shots[key] || [];
        items[i] = checked;
        s.shots[key] = items;
      })
    ) {
      paint();
      main.querySelector('[data-shot="' + i + '"]')?.focus();
    }
    return;
  }
  switch (t.id) {
    case 'period':
      period = Number(t.value);
      break;
    case 'category':
      category = t.value;
      filters();
      return;
    case 'channelFilter':
      channelFilter = t.value;
      filters();
      return;
    case 'statusFilter':
      statusFilter = t.value;
      break;
    case 'studioProduct':
      studioProduct = t.value;
      break;
    case 'templateId':
      templateId = Number(t.value);
      break;
    default:
      return;
  }
  paint();
  document.getElementById(t.id)?.focus();
});

document.addEventListener('submit', async e => {
  const f = e.target;
  e.preventDefault();
  if (!f.reportValidity()) return;
  const data = new FormData(f),
    get = k => String(data.get(k) || '').trim(),
    err = s => {
      const p = f.querySelector('.error');
      if (p) p.textContent = s;
      else toast(s);
    };

  if (f.id === 'editform') {
    const id = get('pid'),
      channels = [],
      urls = {};
    for (let i = 0; i < CHANNELS.length; i++) {
      const c = CHANNELS[i];
      if (!data.has('c' + i)) continue;
      channels.push(c);
      if (get('url' + i)) {
        const u = shopUrl(get('url' + i), c);
        if (!u) {
          err('Hãy nhập đường dẫn HTTPS của ' + c + ' hoặc để trống.');
          return;
        }
        urls[c] = u;
      }
    }
    if (!get('name') || !get('origin') || !get('pack')) {
      err('Vui lòng nhập tên, vùng sản xuất và quy cách.');
      return;
    }
    const save = f.querySelector('[type="submit"]');
    if (save.disabled) return;
    save.disabled = true;
    const uploadedPhoto = f.elements.productPhoto.files.length
      ? f.querySelector('#photoPreview').getAttribute('src')
      : null;
    const details = {
      name: get('name'),
      origin: get('origin'),
      pack: get('pack'),
      price: Number(get('price')),
      rate: Number(get('rate')),
      group: get('group'),
      stars: Number(get('stars')),
      desc: get('desc'),
      channels,
      urls
    };
    try {
      const saved = await change(s => {
        const current = s.products.find(item => item.id === id);
        if (current) {
          Object.assign(current, details);
          if (uploadedPhoto) current.pic = uploadedPhoto;
        } else {
          s.products.push({ id: id || newId('SP'), ...details, pic: uploadedPhoto });
        }
      }, err);
      if (saved && f.isConnected && modal.open) {
        modal.close();
        paint();
        toast('Đã lưu thông tin sản phẩm.');
      }
    } finally {
      save.disabled = false;
    }
    return;
  }

  if (f.id === 'offerform') {
    const pid = get('pid'),
      channel = get('channel'),
      aid = state.active;
    if (
      await change(s => {
        const p = s.products.find(x => x.id === pid);
        if (!p?.channels.includes(channel)) return;
        if (!s.links.some(x => x.pid === pid && x.aid === aid && x.channel === channel)) {
          s.links.unshift({ pid, aid, channel });
        }
      })
    ) {
      go('links');
      toast('Liên kết của bạn đã sẵn sàng.');
    }
    return;
  }

  if (f.id === 'joinform') {
    const name = get('display');
    if (name.length < 2) {
      err('Vui lòng nhập tên có ít nhất 2 ký tự.');
      return;
    }
    const id = newId('dv');
    if (
      await change(s => {
        s.people.push({ id, name });
        s.active = id;
      })
    ) {
      go('discover');
      toast('Đã tham gia với tên ' + name + '.');
    }
    return;
  }

  if (f.id === 'orderform') {
    const pid = get('pid'),
      aid = get('aid'),
      channel = get('channel'),
      id = get('oid'),
      qty = Number(get('qty'));
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) return;
    const button = f.querySelector('button[type=submit]');
    button.disabled = true;
    if (
      await change(s => {
        const p = s.products.find(x => x.id === pid);
        if (!p?.channels.includes(channel) || !s.people.some(a => a.id === aid) || s.orders.some(o => o.id === id)) {
          return;
        }
        s.orders.push({
          id,
          date: pastDay(0),
          pid,
          aid,
          channel,
          qty,
          price: p.price,
          rate: p.rate,
          status: 'pending'
        });
      })
    ) {
      if (!state.orders.some(o => o.id === id)) {
        paint();
        toast('Sản phẩm đã thay đổi. Hãy kiểm tra lại.');
        return;
      }
      topNav();
      f.innerHTML =
        '<div class="offer"><h3>Đã tạo đơn thử thành công</h3><p>Đơn đang chờ chủ cơ sở xác nhận tại trang Tổng quan.</p></div>' +
        btn('Đến tổng quan để xác nhận ' + ic('arrow', 15), 'revieworder', 'primary');
    } else {
      button.disabled = false;
    }
  }
});

window.addEventListener('hashchange', route);
window.addEventListener('storage', e => {
  if (e.key === K) {
    state = readState();
    if (!modal.open) paint();
  }
});

modal.addEventListener('click', e => {
  if (e.target === modal) {
    const r = modal.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
      modal.close();
    }
  }
});

document.addEventListener('keydown', e => {
  if (page === 'deck' && !modal.open && ['ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    takeAction(e.key === 'ArrowRight' ? 'decknext' : 'deckprev', '');
  }
  if (e.key === 'Escape' && !modal.open) {
    screen.classList.remove('menuopen');
    topNav();
  }
});

document.querySelector('.skip').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
});
