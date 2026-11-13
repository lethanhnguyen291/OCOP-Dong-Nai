'use strict';

const CHANNELS = ['Shopee', 'TikTok Shop', 'Lazada'];

const CATALOG = [
  ['Xoài cát Hòa Lộc', 'Xuân Lộc', '1 kg', 69000, 10, 'Trái cây', 'Xoài chín thơm, thịt vàng mềm.'],
  ['Hạt điều rang muối', 'Định Quán', 'Hũ 250 g', 95000, 12, 'Hạt & đồ khô', 'Hạt điều nguyên hạt rang cùng muối.'],
  ['Mật ong hoa nhãn', 'Long Khánh', 'Chai 500 ml', 165000, 8, 'Đồ uống', 'Mật ong dùng pha nước ấm hoặc làm bánh.'],
  ['Bưởi da xanh', 'Tân Triều', '1 trái', 85000, 10, 'Trái cây', 'Bưởi múi hồng, vị ngọt thanh.'],
  ['Cà phê rang mộc', 'Cẩm Mỹ', 'Gói 250 g', 82000, 12, 'Đồ uống', 'Cà phê rang nguyên hạt, thích hợp pha phin.'],
  ['Chuối sấy dẻo', 'Trảng Bom', 'Túi 200 g', 49000, 10, 'Hạt & đồ khô', 'Chuối chín sấy dẻo, đóng túi dùng dần.'],
  ['Tiêu đen nguyên hạt', 'Xuân Lộc', 'Hũ 100 g', 45000, 8, 'Hạt & đồ khô', 'Hạt tiêu nguyên, xay ngay trước khi nấu.'],
  ['Bột ca cao', 'Định Quán', 'Gói 200 g', 98000, 12, 'Đồ uống', 'Ca cao dùng pha nóng hoặc làm bánh.'],
  ['Mít sấy giòn', 'Long Khánh', 'Túi 150 g', 59000, 10, 'Hạt & đồ khô', 'Múi mít sấy giòn, đóng túi nhỏ.'],
  ['Trà lá dứa', 'Thống Nhất', 'Hộp 20 túi', 65000, 10, 'Đồ uống', 'Trà túi lọc với hương lá dứa.']
].map(([name, origin, pack, price, rate, group, desc], i) => ({
  id: 'DN' + String(i + 1).padStart(2, '0'),
  name,
  origin,
  pack,
  price,
  rate,
  group,
  desc,
  pic: i,
  stars: i % 3 === 0 ? 4 : 3,
  channels: i < 3 ? [...CHANNELS] : [CHANNELS[i % 3]],
  urls: {}
}));

const PEOPLE = [
  { id: 'mai', name: 'Mai Anh' },
  { id: 'huy', name: 'Quang Huy' },
  { id: 'linh', name: 'Thảo Linh' }
];

const K = 'nep-ocop-dong-nai:v1';

const money = value => new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
const num = value => new Intl.NumberFormat('vi-VN').format(value);
const dayKey = d => [
  d.getFullYear(),
  String(d.getMonth() + 1).padStart(2, '0'),
  String(d.getDate()).padStart(2, '0')
].join('-');

function pastDay(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dayKey(d);
}

function initialState() {
  const orders = [];
  for (let age = 29; age >= 0; age--) {
    const count = [3, 6, 4, 8, 6, 9, 10][(29 - age) % 7];
    for (let j = 0; j < count; j++) {
      const p = CATALOG[(j * j + age) % 10];
      const who = PEOPLE[(j + age) % 3];
      const qty = 1 + (age + j) % 3;
      orders.push({
        id: 'M' + age + '-' + j,
        date: pastDay(age),
        pid: p.id,
        aid: who.id,
        channel: p.channels[j % p.channels.length],
        qty,
        price: p.price,
        rate: p.rate,
        status: age < 2 && j % 3 === 0 ? 'pending' : j === 5 && age % 4 === 0 ? 'cancel' : 'done'
      });
    }
  }
  return {
    version: 1,
    products: structuredClone(CATALOG),
    people: structuredClone(PEOPLE),
    orders,
    links: [],
    shots: {},
    active: 'mai'
  };
}

function readState() {
  try {
    const o = JSON.parse(localStorage.getItem(K));
    if (
      o?.version === 1 &&
      ['products', 'people', 'orders', 'links'].every(k => Array.isArray(o[k])) &&
      o.people.length &&
      o.shots
    ) {
      return o;
    }
  } catch (e) {}
  return initialState();
}

let state = readState();

function change(fn, reportError = toast) {
  const apply = () => {
    const next = readState();
    fn(next);
    try {
      localStorage.setItem(K, JSON.stringify(next));
      state = next;
      return true;
    } catch (e) {
      const message =
        e.name === 'QuotaExceededError'
          ? 'Bộ nhớ của trình duyệt đã đầy. Hãy thử ảnh có kích thước nhỏ hơn.'
          : 'Trình duyệt chưa cho phép lưu. Hãy mở ở chế độ thông thường.';
      reportError(message);
      return false;
    }
  };
  return navigator.locks?.request ? navigator.locks.request(K, apply) : Promise.resolve(apply());
}

function resetDemoState() {
  try {
    const fresh = initialState();
    localStorage.setItem(K, JSON.stringify(fresh));
    state = fresh;
    return true;
  } catch (e) {
    state = initialState();
    return true;
  }
}

const periodOrders = period =>
  state.orders.filter(o => o.date >= pastDay(period - 1) && o.date <= pastDay(0));

const total = o => o.qty * o.price;
const commission = o => Math.round((total(o) * o.rate) / 100);
const sum = (rows, fn) => rows.reduce((n, o) => n + fn(o), 0);

const esc = x =>
  String(x ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

const product = id => state.products.find(p => p.id === id);
const person = id => state.people.find(a => a.id === id);

const TEMPLATES = [
  {
    name: 'Giới thiệu sản phẩm',
    duration: 30,
    shots: [
      ['0–5 giây', 'Cho người xem thấy sản phẩm', 'Quay cận cảnh {p} cạnh cửa sổ.', 'Đây là {p} từ {o}.'],
      ['5–15 giây', 'Mở gói trước máy quay', 'Quay tay mở gói và đưa phần bên trong lại gần ống kính.', 'Mỗi phần {u}. Mời bạn xem kỹ sản phẩm bên trong.'],
      ['15–24 giây', 'Quay một lần sử dụng', 'Đặt điện thoại cố định và quay cách bạn thường dùng sản phẩm.', 'Ở nhà, mình thường dùng sản phẩm theo cách này.'],
      ['24–30 giây', 'Cho khách biết cách đặt', 'Đặt bao bì cạnh sản phẩm, hướng nhãn về máy quay.', 'Bạn xem giá và quy cách tại đường dẫn sản phẩm nhé.']
    ]
  },
  {
    name: 'Câu chuyện nhà vườn',
    duration: 45,
    shots: [
      ['0–8 giây', 'Giới thiệu người làm', 'Đứng nơi đủ sáng, giữ điện thoại ngang tầm mắt.', 'Mình ở {o}, hôm nay mình giới thiệu {p}.'],
      ['8–23 giây', 'Ghi một công đoạn', 'Quay một công đoạn thật tại cơ sở, xin phép người xuất hiện.', 'Đây là bước mình đang thực hiện hôm nay.'],
      ['23–37 giây', 'Cho thấy thành phẩm', 'Quay gần nhãn và quy cách đóng gói.', 'Mỗi phần {u}, được đóng gói tại cơ sở.'],
      ['37–45 giây', 'Mời khách ghé gian hàng', 'Giữ khung hình ổn định, chỉ vào vị trí liên kết.', 'Bạn có thể xem {p} ở gian hàng của mình.']
    ]
  },
  {
    name: 'Mở hộp cùng khách',
    duration: 20,
    shots: [
      ['0–4 giây', 'Quay kiện hàng', 'Đặt kiện còn nguyên trên mặt bàn sáng.', 'Cùng mở một phần {p} nhé.'],
      ['4–10 giây', 'Mở lớp bảo vệ', 'Quay liền mạch thao tác mở hộp.', 'Mình mở từng lớp để bạn nhìn rõ.'],
      ['10–16 giây', 'Kiểm tra quy cách', 'Quay nhãn cùng toàn bộ phần sản phẩm nhận được.', 'Đây là phần {u} từ {o}.'],
      ['16–20 giây', 'Mở đường dẫn mua', 'Giữ sản phẩm trong hình khi kết thúc.', 'Bạn xem chi tiết ở đường dẫn kèm video nhé.']
    ]
  }
];

const tplText = (s, p) =>
  s.replaceAll('{p}', p.name).replaceAll('{o}', p.origin).replaceAll('{u}', p.pack);

const navs = {
  seller: [
    ['overview', 'Tổng quan', 'grid'],
    ['products', 'Sản phẩm & sàn', 'box'],
    ['studio', 'Hướng dẫn quay', 'video']
  ],
  aff: [
    ['discover', 'Khám phá sản phẩm', 'compass'],
    ['links', 'Liên kết của tôi', 'link'],
    ['income', 'Đơn & hoa hồng', 'wallet']
  ]
};

const titleByPage = Object.fromEntries(
  Object.values(navs).flat().map(([k, v]) => [k, v])
);

const channelHost = {
  'Shopee': ['shopee.vn', 's.shopee.vn', 'vn.shp.ee'],
  'TikTok Shop': ['tiktok.com'],
  'Lazada': ['lazada.vn', 'lazada.com.vn', 's.lazada.vn']
};

function shopUrl(raw, chan) {
  try {
    const u = new URL(raw);
    if (
      u.protocol !== 'https:' ||
      u.username ||
      u.password ||
      !channelHost[chan].some(h => u.hostname === h || u.hostname.endsWith('.' + h))
    ) {
      return '';
    }
    return u.href;
  } catch (e) {
    return '';
  }
}

const IMAGES = CATALOG.map(p => 'anh/' + p.id + '.jpg');
const DECK_URL = 'ho-so/Pitch-deck-OCOP-Dong-Nai.pptx';
