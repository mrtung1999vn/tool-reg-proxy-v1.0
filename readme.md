Bước 1: Cấu Hình Máy Chủ

# Em setup VPS Ubuntu 18.04 trong 5 phút:
apt update && apt install -y git make gcc nodejs npm curl

# Clone repo 3proxy:
git clone https://github.com/z3APA3A/3proxy
cd 3proxy && make -f Makefile.Linux

# Build xong: ./src/3proxy đã có