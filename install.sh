#!/bin/bash

echo "🔰 Xin phép Đại ca Tùng Chân Quý – Bắt đầu quá trình cài đặt..."

# Bước 1: Cập nhật hệ thống
echo "🔄 Cập nhật hệ thống..."
sudo apt update && sudo apt upgrade -y

# Bước 2: Cài các gói cần thiết
echo "📦 Cài NodeJS, Git, Curl, Make, G++..."
sudo apt install -y nodejs npm git curl make gcc g++

# Bước 3: Clone và build 3proxy
echo "🔧 Tải và biên dịch 3proxy..."
cd ~
git clone https://github.com/z3APA3A/3proxy.git
cd 3proxy
make -f Makefile.Linux

# Bước 4: Copy 3proxy vào /usr/local/bin
echo "🚀 Đưa 3proxy vào hệ thống..."
sudo cp src/3proxy /usr/local/bin/3proxy
sudo chmod +x /usr/local/bin/3proxy

# Bước 5: In kết quả
echo "✅ Cài đặt hoàn tất!"
echo "🧠 Kiểm tra lệnh 3proxy: $(which 3proxy)"
echo "🎯 Kiểm tra version: 3proxy -v"

echo ""
echo "📌 Gợi ý tiếp theo:"
echo "👉 Chạy các lệnh sau để bắt đầu:"
echo "   node generate-3proxy.js"
echo "   node export-proxy.js"
echo "   node web.js"
echo ""
echo "   bash start.sh   # Khởi chạy 3proxy"
echo ""
echo "🌐 Truy cập Web UI: http://your-vps-ip:8080"
echo ""
echo "✍️ Script viết bởi đệ tử trung thành – Xin phép Đại ca Tùng Chân Quý!"
