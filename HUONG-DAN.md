# Nếp · OCOP Đồng Nai lên sàn

Bản trình diễn UX/UI cho đề T03, hạn nộp 16/11/2026.

## Mở ứng dụng
Nhấp đúp `index.html` bằng Chrome hoặc Edge. Giữ nguyên các thư mục bên cạnh. Ứng dụng chạy ngoại tuyến, không cần cài đặt hoặc build. Muốn mở trang bán thật đã nhập, máy cần Internet.

## Chạy một lượt trình diễn
1. Trong **Tổng quan**, xem doanh thu, sản phẩm bán chạy và đoàn viên nổi bật. Chọn 7 hoặc 30 ngày. Có thể chuyển nhanh giữa hai vai trò **Chủ cơ sở** và **Đoàn viên** ngay trên thanh tiêu đề trên cùng.
2. Trong **Sản phẩm & sàn**, mở **Quản lý**. Chọn sàn và nhập đường dẫn của sản phẩm nếu có. Mỗi sản phẩm có giá, quy cách và tỷ lệ hoa hồng riêng.
3. Trong **Hướng dẫn quay**, chọn sản phẩm và mẫu video. Đánh dấu từng cảnh đã quay. Tiến độ được lưu theo từng mẫu và sản phẩm (có thể nhấn **Đặt lại cảnh quay** để làm mới).
4. Từ **Tổng quan**, chọn **Mời đoàn viên**, mở lời mời và nhập tên để thử vai trò đoàn viên mới. Bạn cũng có thể dùng ngay tài khoản mẫu trong **Khám phá sản phẩm**.
5. Chọn **Xoài cát Hòa Lộc → Giới thiệu → Tạo liên kết của tôi → Mở thử**. Đặt số lượng 2. Đơn thử trị giá 138.000 đồng, hoa hồng dự kiến 13.800 đồng theo giá và tỷ lệ mẫu.
6. Nhấn **Đến tổng quan để xác nhận → Xác nhận hoàn tất**. Mở **Đơn & hoa hồng** bằng đúng tài khoản đoàn viên để xem khoản đã ghi nhận. Hủy một đơn thử khác để kiểm tra trường hợp hoa hồng bằng 0.
7. Sau khi trình diễn xong một lượt, có thể nhấn **Khôi phục dữ liệu mẫu** ở cuối thanh điều hướng bên trái để đặt lại toàn bộ dữ liệu về ban đầu.

## Báo cáo doanh thu
Trong **Tổng quan**, chọn 7 ngày, 30 ngày hoặc **Chọn ngày…**, rồi chọn một sàn hoặc tất cả sàn. Kỳ báo cáo tính theo ngày đặt đơn, gồm cả ngày đầu và cuối. Biểu đồ gộp ngày khi kỳ dài hơn 30 ngày. Doanh thu và hoa hồng ghi nhận chỉ tính đơn hoàn tất. Mục đơn thử chờ xử lý luôn hiển thị mọi đơn cần xác nhận.

Chọn **Xuất báo cáo** và tải CSV tổng hợp theo sàn hoặc CSV chi tiết từng đơn. CSV chứa dữ liệu trong kỳ và sàn đang xem. Khi mở bằng Excel, nếu các cột chưa tách, nhập tệp dưới dạng UTF-8 và chọn dấu phẩy. Cột tiền dùng đơn vị đồng. Mỗi đơn dùng giá và tỷ lệ hoa hồng tại lúc đặt.

## Hồ sơ bàn giao
- `ho-so/Pitch-deck-OCOP-Dong-Nai.pptx` — 10 slide có thể chỉnh sửa trong PowerPoint.
- `ho-so/Mockup-6-man-hinh.pdf` — ba màn hình chủ cơ sở và ba màn hình đoàn viên, mỗi màn có bản máy tính và điện thoại.
- `ho-so/Ke-hoach-90-ngay.pdf` — sáu giai đoạn từ 17/11/2026 đến 14/02/2027, danh mục 10 sản phẩm, người phụ trách và tiêu chí nghiệm thu.

## Vị trí chỉnh sửa
- `giao-dien.css` quy định màu sắc, chữ, bố cục và cách hiển thị trên điện thoại.
- `js/du-lieu.js` chứa danh mục, đơn mẫu, cách tính hoa hồng và mẫu kịch bản.
- `js/man-hinh.js` dựng các màn hình chính. `js/thao-tac.js` xử lý biểu mẫu, liên kết, lời mời và trạng thái đơn.
- `js/ho-so.js` chứa nội dung kế hoạch và pitch deck hiển thị trong web. Hai tệp PDF và PowerPoint là tài liệu bàn giao tĩnh.
- `anh/` chứa 10 ảnh sản phẩm minh họa. Các tệp ở `js/` dùng JavaScript thông thường.

## Phạm vi bản thử
Tên sản phẩm, hạng sao, giá bán, đơn hàng, hoa hồng và danh tính là dữ liệu minh họa. Danh mục cần được xác minh với cơ sở trước khi đưa lên bán. Dữ liệu thay đổi chỉ lưu trên trình duyệt hiện tại. Chạy hai vai trò trong cùng trình duyệt để thấy kết quả liên thông. Liên kết dạng tệp cục bộ sử dụng trên cùng máy.

Bản thử cho phép lưu và mở trang sản phẩm thật của ba sàn, mô phỏng đơn và đối soát hoa hồng tại máy. Việc tự đăng sản phẩm, đồng bộ đơn thật, xác thực tài khoản nhiều người và chi trả cần triển khai ở giai đoạn thí điểm. Kế hoạch đã nêu phương án dùng báo cáo do chủ gian hàng xuất khi chưa được cấp quyền tự động.
