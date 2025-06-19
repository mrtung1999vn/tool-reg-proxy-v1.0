#!/bin/bash

echo "🔧 Tạo file cấu hình..."
node generate-3proxy.js

echo "📦 Xuất danh sách proxy..."
node export-proxy.js

echo "🚀 Khởi chạy 3proxy..."
3proxy ./3proxy.cfg
