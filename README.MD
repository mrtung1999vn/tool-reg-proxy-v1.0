✅ 📄 File README.md đầy đủ:
markdown
Sao chép
Chỉnh sửa
# 🔐 Proxy Registration Tool - NodeJS + 3proxy
Tool tạo hàng loạt proxy IPv6 dạng `user:pass@ip:port`, hỗ trợ:
✅ Tự động sinh `proxy.cfg` cho 3proxy  
✅ Tạo file `proxy.txt` gửi cho khách  
✅ Giao diện Web UI đơn giản để xem danh sách proxy  
✅ Chạy trực tiếp trên Windows và Ubuntu – không cần Docker  
✅ Tùy chỉnh `user:pass`, port, prefix IPv6 dễ dàng  
✅ Tự động lấy IP Public trên mọi hệ điều hành

---

## 📁 Cấu trúc thư mục

proxy-tool/
├── config.js # Cấu hình số lượng proxy, prefix
├── ipv6-gen.js # Sinh danh sách IPv6 từ prefix
├── generate-3proxy.js # Tạo file 3proxy.cfg
├── export-proxy.js # Tạo file proxy.txt
├── web.js # Web UI xem proxy
├── start.sh # Script khởi động (Linux)
└── .gitignore # Bỏ file không cần push Git

yaml
Sao chép
Chỉnh sửa

---

## 🧰 Cài đặt

### 🔧 Yêu cầu:
- Node.js (>= v14)
- curl (có sẵn trong Windows 10+ và Ubuntu)
- Đã build/cài 3proxy

### ✅ Cài Node & thư viện:

#### Ubuntu:
```bash
sudo apt update
sudo apt install nodejs npm git make g++ curl -y
Windows:
Tải Node.js tại: https://nodejs.org

Cài Git Bash nếu cần .sh

🚀 Hướng dẫn sử dụng
1. Cấu hình file config.js
js
Sao chép
Chỉnh sửa
const ipv6Prefix = '2001:db8:abcd';  // IPv6 Prefix thật
const proxyCount = 100;              // Số lượng proxy
const basePort = 30000;              // Port bắt đầu
Tool sẽ tự sinh:
proxy001:secret001@your_ip:30000
proxy002:secret002@your_ip:30001
...

2. Chạy tool
bash
Sao chép
Chỉnh sửa
node generate-3proxy.js   # Tạo file 3proxy.cfg
node export-proxy.js      # Tạo file proxy.txt
node web.js               # Web hiển thị danh sách
Truy cập: http://localhost:8080
Hoặc: http://your_public_ip:8080

3. Khởi chạy 3proxy
Ubuntu:
bash
Sao chép
Chỉnh sửa
bash start.sh
Windows:
Tải 3proxy tại: https://3proxy.ru

Chạy: 3proxy.exe 3proxy.cfg

🌐 Giao diện Web UI

Danh sách proxy tự động hiển thị trên browser

📦 Kết quả đầu ra
File proxy.txt:

graphql
Sao chép
Chỉnh sửa
proxy001:secret001@123.123.123.123:30000
proxy002:secret002@123.123.123.123:30001
...
🛑 .gitignore đi kèm:
gitignore
Sao chép
Chỉnh sửa
node_modules/
proxy.txt
3proxy.cfg
.env
.vscode/
💡 Tính năng nâng cấp sắp tới
 Giao diện UI đẹp hơn (React/Vue)

 Export .CSV có ghi chú từng IP

 API quản lý proxy động (POST / DELETE)

 Tạo proxy IPv4 nếu máy hỗ trợ

📬 Liên hệ & hỗ trợ
Zalo / Telegram: @quachthanhtung

Facebook: fb.com/quachthanhtung99

☕ Ủng hộ tác giả nếu bạn thấy hữu ích
Để mình có động lực update thêm! ❤️

Momo
📱 036.6262.072

PayPal
📧 quachthanhtung1999@gmail.com

📜 Giấy phép
MIT License – Dùng thoải mái cho cá nhân hoặc thương mại.

yaml
Sao chép
Chỉnh sửa

---

✅ Bạn chỉ cần:
- Lưu nội dung trên thành `README.md`
- Thêm ảnh demo nếu muốn (mình có thể tạo sẵn)
- Push lên GitHub là xong

---

Bạn muốn mình:
- Nén **toàn bộ project + README + .gitignore** thành file `.zip` gửi lại?
- Tạo luôn **repo GitHub mẫu** public cho bạn clone nhanh?

➡️ Chỉ cần nhắn: **"Tạo file zip"** hoặc **"Push lên GitHub demo giúp tôi"**.











# Cài Đặt
Dưới đây là hướng dẫn đầy đủ giúp bạn cài đặt và cấu hình nhanh môi trường Ubuntu để chạy tool proxy NodeJS + 3proxy:

✅ 1. Cài đặt Ubuntu trên VPS
Khi tạo VPS (như ảnh bạn gửi), chọn:

Hệ điều hành: Ubuntu

Phiên bản đề xuất: Ubuntu 20.04 LTS hoặc Ubuntu 22.04 LTS

✅ 2. Sau khi tạo VPS xong: SSH vào và chạy các lệnh sau
📦 Cài đặt đầy đủ môi trường để chạy tool:
bash
Sao chép
Chỉnh sửa
sudo apt update && sudo apt upgrade -y

# Cài Node.js + npm
sudo apt install nodejs npm -y

# Cài curl, git, make, build-essential (dành cho 3proxy)
sudo apt install curl git make g++ -y

# Kiểm tra Node đã cài thành công chưa
node -v
npm -v
✅ 3. Clone tool về VPS (nếu push GitHub)
bash
Sao chép
Chỉnh sửa
git clone https://github.com/your-username/proxy-tool.git
cd proxy-tool
Nếu bạn chưa có GitHub, có thể upload bằng scp hoặc wget từ Google Drive/ZippyShare/Transfer.sh...

✅ 4. Chạy tool (ví dụ)
bash
Sao chép
Chỉnh sửa
node generate-3proxy.js
node export-proxy.js
node web.js
→ Truy cập trình duyệt: http://your-vps-ip:8080

✅ 5. Khởi động 3proxy (đã cài thủ công)
bash
Sao chép
Chỉnh sửa
bash start.sh
Hoặc nếu dùng binary:

bash
Sao chép
Chỉnh sửa
./3proxy 3proxy.cfg
✅ 6. (Tuỳ chọn) Cài 3proxy từ source:
bash
Sao chép
Chỉnh sửa
sudo apt install gcc g++ make -y
git clone https://github.com/z3APA3A/3proxy.git
cd 3proxy
make -f Makefile.Linux
🎁 Tổng lệnh gộp lại (copy 1 lần):
bash
Sao chép
Chỉnh sửa
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm curl git make g++ -y
git clone https://github.com/your-username/proxy-tool.git
cd proxy-tool
node generate-3proxy.js
node export-proxy.js
node web.js
Bạn cần mình:

✅ Viết file install.sh auto cài tất cả?

✅ Tạo bản .zip tool này tải về chạy ngay?