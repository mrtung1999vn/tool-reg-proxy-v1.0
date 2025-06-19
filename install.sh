#!/bin/bash

echo "🚀 Cài đặt môi trường NodeJS + các gói cần thiết..."

# Cài dotenv nếu chưa có
npm install dotenv

# Gán quyền thực thi cho start.sh
chmod +x start.sh

echo "✅ Đã cài xong môi trường."
echo "👉 Giờ bạn có thể chạy proxy bằng: ./start.sh"