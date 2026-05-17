#!/usr/bin/env bash
set -euo pipefail

echo "== Gestion RH - Oracle Cloud setup =="

if ! command -v docker >/dev/null 2>&1; then
  echo "Installing Docker..."
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo usermod -aG docker "$USER"
fi

if [ ! -f .env ]; then
  echo "Creating .env..."
  POSTGRES_PASSWORD="$(openssl rand -base64 24 | tr -d '\n')"
  JWT_SECRET="$(openssl rand -base64 48 | tr -d '\n')"
  cat > .env <<EOF
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
JWT_SECRET=${JWT_SECRET}
EOF
fi

echo "Building and starting containers..."
sudo docker compose up -d --build

echo "Opening firewall on the VM..."
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw allow 22/tcp || true

echo "Done."
echo "Open: http://YOUR_ORACLE_PUBLIC_IP"
echo "Default login: admin@gestionrh.com / admin123"
