#!/bin/bash
echo "🚀 Bắt đầu generate cấu hình và khởi chạy 3proxy..."
node generate-3proxy.js
./3proxy/bin/3proxy ./3proxy.cfg