#!/bin/bash

echo "🚀 Bắt đầu generate cấu hình và khởi chạy 3proxy..."

# Chạy NodeJS để sinh file config và proxy.txt
node generate-3proxy.js

# Khởi chạy 3proxy
./3proxy/bin/3proxy ./3proxy.cfg
echo "✅ Đã khởi chạy 3proxy thành công."
echo "👉 Bạn có thể dừng 3proxy bằng Ctrl+C hoặc lệnh kill nếu