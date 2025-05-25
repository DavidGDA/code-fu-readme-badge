FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    # Instalacion de python3
    python3 \
    python3-pip \
    python3-venv \
    # Dependencias del navegador chromium de puppeteer
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils


RUN python3 -m venv .venv
RUN .venv/bin/pip install --upgrade pip

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
ADD puppeteer.config.cjs /app/puppeteer.config.cjs

RUN npm install

COPY requirements.txt /app/requirements.txt

RUN .venv/bin/pip install -r requirements.txt

ADD src /app/src
RUN chmod +x /app/src/libs/badges_generator.py

# En produccion, se debe usar el puerto de la variable de entorno PORT de heroku
EXPOSE 3000

CMD ["npm", "run", "start"]