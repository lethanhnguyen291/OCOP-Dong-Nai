const PHASES = [
  [
    '1–14',
    '17–30/11/2026',
    'Chọn cơ sở và xác minh hồ sơ',
    'Điều phối viên + chủ cơ sở',
    'Đối chiếu chứng nhận OCOP còn hiệu lực, quy cách, tồn kho, giá và quyền dùng ảnh. Xin đồng ý tham gia của chủ cơ sở.',
    '10/10 hồ sơ được xác minh hoặc có sản phẩm thay thế trước khi đăng.'
  ],
  [
    '15–30',
    '01–16/12/2026',
    'Chạy lô đầu tiên',
    'Phụ trách sàn + nhóm video',
    'Quay video 4 cảnh cho từng sản phẩm của lô A. Đăng 3 sản phẩm trên sàn đã chọn. Mời và tập huấn 5 đoàn viên đầu tiên.',
    '3/10 sản phẩm có đường dẫn mở được, giá và tồn kho khớp; hoàn tất một đơn kiểm thử theo quy trình của sàn.'
  ],
  [
    '31–45',
    '17–31/12/2026',
    'Mở lô thứ hai',
    'Chủ cơ sở + đầu mối đoàn viên',
    'Đưa 3 sản phẩm lô B lên bán. Phân mã giới thiệu theo sản phẩm và sàn. Kiểm tra giao hàng, thu nhận phản hồi về đóng gói.',
    '6/10 sản phẩm đã mở bán. Từng đoàn viên tự tạo được liên kết và nhận diện được đơn của mình.'
  ],
  [
    '46–60',
    '01–15/01/2027',
    'Hoàn thiện 10 sản phẩm',
    'Phụ trách sàn + kỹ thuật',
    'Đưa 4 sản phẩm lô C lên bán. Kiểm tra cả ba kênh. Nhập báo cáo đơn được sàn cho phép và đối chiếu mã giới thiệu.',
    '10/10 sản phẩm có ít nhất một trang bán hoạt động; toàn danh mục có mặt trên cả 3 sàn.'
  ],
  [
    '61–75',
    '16–30/01/2027',
    'Đối soát và cải thiện',
    'Đối soát viên + nhóm nội dung',
    'Đối chiếu đơn hoàn tất, hoàn trả, hủy và phí từng sàn mỗi tuần. Thử hai cách mở đầu video cho ba sản phẩm ít chuyển đổi.',
    'Mỗi khoản hoa hồng truy được về mã đơn và người giới thiệu. Ghi nguyên nhân và người xử lý từng chênh lệch.'
  ],
  [
    '76–90',
    '31/01–14/02/2027',
    'Đánh giá và bàn giao',
    'Trưởng nhóm + đại diện cơ sở',
    'Tổng hợp doanh thu theo đơn hoàn tất, đơn giới thiệu, chi phí và phản hồi. Bàn giao danh mục, tài khoản sàn và lịch đối soát.',
    'Mục tiêu đề xuất: 10 sản phẩm đang bán, 20 đoàn viên được tập huấn, ít nhất 30 đơn giới thiệu hoàn tất. Quyết định tiếp tục theo lợi nhuận thực và khả năng vận hành.'
  ]
];

const SLIDES = [
  [
    'OCOP Đồng Nai lên sàn',
    'Nếp kết nối chủ cơ sở với đoàn viên giới thiệu đặc sản trên TikTok Shop, Shopee và Lazada.',
    'Hồ sơ dự thi · 16/11/2026',
    'fruit'
  ],
  [
    'Sau hội chợ, khách mua ở đâu?',
    'Theo đề bài, Đồng Nai có hơn 150 sản phẩm OCOP 3–4 sao, chủ yếu bán trực tiếp tại hội chợ.',
    'Chủ cơ sở cần một trang bán để khách quay lại đặt hàng. Nhiều người chưa quen marketing số, tự quay video hoặc livestream.',
    'cashew'
  ],
  [
    'Một sản phẩm, hai người cùng bán',
    'Chủ cơ sở nhập giá, quy cách và chọn sàn. Đoàn viên chọn sản phẩm, tạo liên kết riêng rồi giới thiệu tới người mua.',
    'Khách mở đường dẫn sản phẩm của sàn. Khi sàn xác nhận đơn hợp lệ, nhóm đối soát mới ghi nhận hoa hồng.',
    'honey'
  ],
  [
    'Ba màn hình cho chủ cơ sở',
    'Tổng quan cho biết sản phẩm nào bán chạy và ai giới thiệu hiệu quả. Sản phẩm & sàn lưu thông tin và đường dẫn bán.',
    'Hướng dẫn quay chia video thành từng cảnh. Người bán có thể đánh dấu cảnh đã quay và quay lại làm tiếp.',
    'seller'
  ],
  [
    'Một video xoài trong 30 giây',
    '0–5 giây: quay cận quả xoài. 5–15 giây: mở gói, đưa sản phẩm lại gần máy.',
    '15–24 giây: quay cách dùng. 24–30 giây: giữ nhãn trong khung hình và mời khách xem liên kết. Mỗi cảnh có sẵn lời thoại để tập đọc.',
    'studio'
  ],
  [
    'Ba màn hình cho đoàn viên',
    'Khám phá sản phẩm hiển thị giá và tỷ lệ hoa hồng. Liên kết của tôi lưu từng đường dẫn theo sản phẩm và sàn.',
    'Đơn & hoa hồng phân biệt đơn chờ xác nhận, đã hoàn tất và đã hủy. Người mới tham gia bằng lời mời của chủ cơ sở.',
    'aff'
  ],
  [
    'Một đơn xoài được ghi nhận ra sao?',
    'Ví dụ thử nghiệm: 2 kg xoài × 69.000 đồng = 138.000 đồng. Với tỷ lệ 10%, hoa hồng dự kiến là 13.800 đồng.',
    'Đơn chờ xác nhận chỉ hiện số dự kiến. Khi hoàn tất, doanh thu tăng 138.000 đồng và hoa hồng ghi nhận tăng 13.800 đồng. Đơn hủy hưởng 0 đồng.',
    'order'
  ],
  [
    'Điều kiện để bán thật',
    'Chủ cơ sở xác minh chứng nhận OCOP, tồn kho, giá, quy cách và người chịu trách nhiệm xử lý đơn.',
    'Phụ trách sàn kiểm tra trang bán, quyền nhận dữ liệu đơn và quy tắc hoa hồng. Chạy thử đối soát theo mã đơn trước khi thanh toán cho đoàn viên.',
    'pomelo'
  ],
  [
    '90 ngày cho 10 sản phẩm',
    'Ngày 1–14: xác minh hồ sơ. Ngày 15–30: mở bán 3 sản phẩm đầu. Ngày 31–45: thêm 3. Ngày 46–60: thêm 4.',
    'Ngày 61–90: xử lý sai lệch, thử nội dung và bàn giao. Mỗi sản phẩm cần ít nhất một đường dẫn mua hoạt động. Cả danh mục phủ đủ ba sàn.',
    'pilot'
  ],
  [
    'Đề xuất khởi động thí điểm',
    'Mời các cơ sở có 10 sản phẩm đủ điều kiện và một đầu mối Đoàn tại địa phương cùng tham gia.',
    'Mục tiêu ngày 90: 10 sản phẩm đang bán, 20 đoàn viên được tập huấn và 30 đơn giới thiệu hoàn tất. Nhóm dùng kết quả đối soát và lợi nhuận thực để quyết định mở rộng.',
    'end'
  ]
];

let slideIndex = 0;
const lots = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8, 9]
];

function planContent() {
  return (
    '<p class="notice">Đề xuất khởi động ngày 17/11/2026, sau hạn nộp 16/11. Danh mục là ứng viên minh họa; cơ sở tham gia xác nhận tên thương mại và chứng nhận trước khi công bố.</p>' +
    '<section class="card sectiongap"><h2>Các mốc triển khai</h2>' +
    PHASES.map(
      ([days, dates, title, who, what, accept]) =>
        '<article class="milestone"><small>Ngày ' +
        days +
        ' · ' +
        dates +
        '</small><h3>' +
        title +
        '</h3><p><b>Phụ trách</b> · ' +
        who +
        '</p><p>' +
        what +
        '</p><p><b>Nghiệm thu</b> · ' +
        accept +
        '</p></article>'
    ).join('') +
    '</section><section class="card sectiongap"><h2>Danh mục 10 sản phẩm dự kiến</h2><div class="twrap"><table><thead><tr><th>Mã</th><th>Sản phẩm</th><th>Lô</th><th>Sàn ưu tiên</th><th>Hạn mở bán</th></tr></thead><tbody>' +
    CATALOG.map((p, i) => {
      const lot = lots.findIndex(ns => ns.includes(i));
      return (
        '<tr><td><b>' +
        p.id +
        '</b></td><td>' +
        p.name +
        '</td><td><span class="chip">Lô ' +
        ['A', 'B', 'C'][lot] +
        '</span></td><td><span class="chan-pill ' +
        chanClass(CHANNELS[i % 3]) +
        '">' +
        CHANNELS[i % 3] +
        '</span></td><td>' +
        ['16/12/2026', '31/12/2026', '15/01/2027'][lot] +
        '</td></tr>'
      );
    }).join('') +
    '</tbody></table></div></section><section class="card sectiongap stack"><h2>Vận hành và đo kết quả</h2>' +
    '<p><b>Tiêu chí mở bán.</b> Chủ cơ sở duyệt sản phẩm, cung cấp ảnh thật và chứng nhận. Đầu mối sàn thử mở liên kết trên điện thoại, kiểm tra giá, tồn kho và cách giao hàng.</p>' +
    '<p><b>Đối soát hàng tuần.</b> Lưu mã sàn, mã đơn, sản phẩm, số tiền đủ điều kiện và người giới thiệu. Khóa trùng theo sàn và mã đơn. Đơn chờ chỉ dự kiến, đơn hủy hưởng 0 đồng. Nếu hoàn trả sau đối soát, ghi điều chỉnh vào kỳ sau.</p>' +
    '<p><b>Đo hiệu quả.</b> Theo dõi sản phẩm đang bán, đơn hoàn tất, doanh thu, hoa hồng và lợi nhuận sau giá vốn, phí sàn, vận chuyển hỗ trợ. Báo cáo số thiếu dữ liệu riêng.</p>' +
    '<p><b>Khi có sự cố.</b> Hết hàng thì chủ cơ sở báo đoàn viên ngừng chia sẻ. Nếu thiếu dữ liệu hoặc sai tiền, phụ trách đối soát giữ khoản liên quan đến khi khớp báo cáo sàn. Nếu chưa có quyền kết nối tự động, dùng tệp báo cáo do chủ gian hàng xuất hợp lệ.</p>' +
    '</section>'
  );
}

function planView() {
  return (
    head('Kế hoạch thí điểm 90 ngày', '17/11/2026 – 14/02/2027 · Mở bán 10 sản phẩm trên ba sàn.', btn('In / lưu PDF', 'print')) +
    planContent()
  );
}

function deckView() {
  const [title, a, b, img] = SLIDES[slideIndex],
    imgMap = {
      fruit: 0,
      cashew: 1,
      honey: 2,
      seller: 3,
      studio: 0,
      aff: 5,
      order: 0,
      pomelo: 3,
      pilot: 8,
      end: 7
    };
  const dots = SLIDES.map(
    (s, idx) =>
      '<button type="button" class="slidedot ' +
      (idx === slideIndex ? 'active' : '') +
      '" data-act="gotoslide" data-id="' +
      idx +
      '" aria-label="Slide ' +
      (idx + 1) +
      ': ' +
      esc(s[0]) +
      '" title="' +
      esc(idx + 1 + '. ' + s[0]) +
      '"></button>'
  ).join('');
  return (
    head('Pitch deck', 'OCOP Đồng Nai lên sàn · 10 slide thuyết trình', btn('Tải PowerPoint', 'downloadDeck', 'primary')) +
    '<article class="deckslide"><div><small>NẾP / OCOP ĐỒNG NAI · SLIDE ' +
    String(slideIndex + 1).padStart(2, '0') +
    '</small><h2>' +
    title +
    '</h2><p>' +
    a +
    '</p><p>' +
    b +
    '</p></div><img src="' +
    IMAGES[imgMap[img]] +
    '" alt="Ảnh minh họa sản phẩm"></article><div class="deckbar"><div class="slidedots">' +
    dots +
    '</div><div class="row"><button type="button" data-act="deckprev" ' +
    (slideIndex === 0 ? 'disabled' : '') +
    '>Trước</button><span class="slidecount"><b>' +
    (slideIndex + 1) +
    '</b> / 10</span><button type="button" class="primary" data-act="decknext" ' +
    (slideIndex === 9 ? 'disabled' : '') +
    '>Sau ' +
    ic('arr', 14) +
    '</button></div></div>'
  );
}

function downloadDeck() {
  const a = document.createElement('a');
  a.href = DECK_URL;
  a.download = 'Pitch-deck-OCOP-Dong-Nai.pptx';
  a.click();
}

route();
