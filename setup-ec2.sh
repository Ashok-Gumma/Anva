#!/bin/bash
# ==============================================================================
# Anva EC2 Free Tier Automated Setup Script (Ubuntu 22.04 / 24.04 LTS)
# ==============================================================================

set -e

echo "🚀 Starting Anva EC2 Free Tier Server Setup..."

# 1. Update and Upgrade System
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Add 2GB Swap Memory (CRITICAL for AWS Free Tier 1GB RAM t2.micro)
echo "💾 Checking and configuring Swap memory..."
if [ $(swapon --show | wc -l) -eq 0 ]; then
    echo "Creating 2GB swap file..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ 2GB Swap memory activated successfully!"
else
    echo "Swap is already enabled."
fi

# 3. Install Required Tools (Git, Nginx, Certbot, Docker, Node.js)
echo "🔧 Installing build tools, Nginx, Certbot, and Docker..."
sudo apt install -y curl wget git build-essential nginx certbot python3-certbot-nginx docker.io docker-compose

# 4. Install Node.js 20 LTS & PM2
echo "🟢 Installing Node.js 20 LTS and PM2..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# 5. Enable and Start Docker & Nginx
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

sudo systemctl enable nginx
sudo systemctl start nginx

echo "=============================================================================="
echo "🎉 Server Setup Completed Successfully!"
echo "Node Version: $(node -v)"
echo "NPM Version: $(npm -v)"
echo "PM2 Version: $(pm2 -v)"
echo "Docker Version: $(docker --version)"
echo "=============================================================================="
