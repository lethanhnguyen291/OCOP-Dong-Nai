// Bộ lọc của trang Tổng quan độc lập với lịch sử hoa hồng của đoàn viên.
let reportChannel = '';
let reportPeriod = '7';
let reportCustomRange = null;

function reportRange() {
  if (reportPeriod === 'custom') return reportCustomRange;
  return { from: pastDay(Number(reportPeriod) - 1), to: pastDay(0) };
}

const displayReportDate = date => date.split('-').reverse().join('/');

function salesReport() {
  const { from, to } = reportRange();
  const channels = reportChannel ? [reportChannel] : CHANNELS;
  const rows = state.orders.filter(o =>
    o.date >= from && o.date <= to && (!reportChannel || o.channel === reportChannel)
  );
  const done = rows.filter(o => o.status === 'done');
  const byChannel = channels.map(channel => {
    const orders = rows.filter(o => o.channel === channel);
    const complete = orders.filter(o => o.status === 'done');
    return {
      channel, complete: complete.length,
      pending: orders.filter(o => o.status === 'pending').length,
      cancelled: orders.filter(o => o.status === 'cancel').length,
      revenue: sum(complete, total), fee: sum(complete, commission)
    };
  });
  return { from, to, rows, done, byChannel };
}

function reportControls() {
  return '<label class="dater">' + ic('calendar', 16) +
    '<select id="reportPeriod" aria-label="Kỳ báo cáo">' +
    options([['7', '7 ngày qua'], ['30', '30 ngày qua'], ['custom', 'Chọn ngày…']], reportPeriod) +
    '</select></label><label class="dater">' + ic('shop', 16) +
    '<select id="reportChannel" aria-label="Sàn trong báo cáo">' +
    options([['', 'Tất cả sàn'], ...CHANNELS.map(c => [c, c])], reportChannel) +
    '</select></label>' + (reportPeriod === 'custom' ? btn('Đổi ngày', 'reportDates') : '') +
    btn('Xuất báo cáo', 'reportExport', 'primary');
}

function chooseReportDates() {
  const { from, to } = reportCustomRange || reportRange();
  dialog('Chọn kỳ báo cáo', '<form id="reportDates" class="stack"><div class="formgrid">' +
    field('Từ ngày', '<input name="from" type="date" required value="' + from + '">') +
    field('Đến ngày', '<input name="to" type="date" required value="' + to + '">') +
    '</div><div class="actions">' + btn('Đóng', 'close') +
    '<button type="submit" class="primary">Áp dụng</button></div></form>');
}

function channelBreakdown(report) {
  const contents = report.byChannel.map(row =>
    '<tr><th scope="row">' + esc(row.channel) + '</th><td class="r">' + row.complete +
    '</td><td class="r">' + row.pending + '</td><td class="r">' + row.cancelled +
    '</td><td class="r"><b>' + money(row.revenue) + '</b></td><td class="r">' + money(row.fee) + '</td></tr>'
  ).join('');
  return '<section class="card sectiongap"><div class="cardhead"><h2>Doanh thu theo sàn</h2></div>' +
    '<div class="twrap"><table aria-label="Doanh thu và trạng thái đơn theo sàn"><thead><tr><th>Sàn</th>' +
    '<th class="r">Hoàn tất</th><th class="r">Chờ xác nhận</th><th class="r">Đã hủy</th>' +
    '<th class="r">Doanh thu</th><th class="r">Hoa hồng</th></tr></thead><tbody>' + contents +
    '</tbody></table></div></section>';
}

// Gộp các ngày liên tiếp khi kỳ báo cáo dài để biểu đồ vẫn đọc được trên điện thoại.
function revenueSeries(report) {
  const dayMs = 86400000;
  const first = Date.parse(report.from + 'T00:00:00Z');
  const last = Date.parse(report.to + 'T00:00:00Z');
  const days = Math.round((last - first) / dayMs) + 1;
  const width = Math.ceil(days / 30);
  const iso = time => new Date(time).toISOString().slice(0, 10);
  const series = Array.from({length: Math.ceil(days / width)}, (_, i) => {
    const start = first + i * width * dayMs;
    return { from: iso(start), to: iso(Math.min(last, start + (width - 1) * dayMs)), value: 0 };
  });
  for (const order of report.done) {
    const offset = (Date.parse(order.date + 'T00:00:00Z') - first) / dayMs;
    series[Math.floor(offset / width)].value += total(order);
  }
  return series;
}

function reportExportDialog() {
  const { from, to, rows } = salesReport();
  dialog('Xuất báo cáo CSV', '<p>' + displayReportDate(from) + ' – ' + displayReportDate(to) +
    ' · ' + esc(reportChannel || 'Tất cả sàn') + ' · ' + rows.length + ' đơn</p>' +
    '<div class="stack sectiongap"><div><h3>Tổng hợp theo sàn</h3>' +
    '<p class="help">Số đơn theo trạng thái, doanh thu và hoa hồng đã ghi nhận.</p>' +
    btn('Tải CSV tổng hợp', 'reportSummary') + '</div><div><h3>Chi tiết từng đơn</h3>' +
    '<p class="help">Mã đơn, sản phẩm, đoàn viên, số lượng, giá và hoa hồng để đối soát.</p>' +
    btn('Tải CSV chi tiết', 'reportOrders') + '</div></div>');
}

function csvValue(value) {
  if (typeof value === 'number') return String(value);
  let text = String(value ?? '');
  if (/^\s*[=+\-@]|^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

function downloadReport(detail) {
  const { from, to, rows, byChannel } = salesReport();
  let table;
  if (detail) {
    table = [['Ngày đặt', 'Mã đơn', 'Sàn', 'Mã sản phẩm', 'Tên sản phẩm', 'Mã đoàn viên', 'Đoàn viên',
      'Trạng thái', 'Số lượng', 'Đơn giá (VND)', 'Giá trị đơn (VND)', 'Hoa hồng (%)', 'Doanh thu ghi nhận (VND)', 'Hoa hồng ghi nhận (VND)']];
    for (const o of [...rows].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))) {
      const complete = o.status === 'done';
      table.push([o.date, o.id, o.channel, o.pid, product(o.pid)?.name || o.pid, o.aid,
        person(o.aid)?.name || o.aid, statusName(o.status), o.qty, o.price, total(o), o.rate,
        complete ? total(o) : 0, complete ? commission(o) : 0]);
    }
  } else {
    table = [['Từ ngày', 'Đến ngày', 'Sàn', 'Đơn hoàn tất', 'Đơn chờ xác nhận', 'Đơn đã hủy', 'Doanh thu (VND)', 'Hoa hồng ghi nhận (VND)']];
    for (const s of byChannel) table.push([from, to, s.channel, s.complete, s.pending, s.cancelled, s.revenue, s.fee]);
  }
  const csv = '\uFEFF' + table.map(row => row.map(csvValue).join(',')).join('\r\n') + '\r\n';
  const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
  const anchor = document.createElement('a');
  const scope = reportChannel ? reportChannel.toLowerCase().replaceAll(' ', '-') : 'tat-ca-san';
  anchor.href = url;
  anchor.download = ['OCOP', detail ? 'chi-tiet-don' : 'tong-hop', scope, from, to].join('_') + '.csv';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
