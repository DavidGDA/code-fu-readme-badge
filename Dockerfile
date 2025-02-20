FROM node:22.14.0

WORKDIR /app


COPY package.json /app/package.json
COPY index.js /app/index.js
COPY requirements.txt /app/requirements.txt

ADD util /app/util
ADD public/badges /app/public/badges

RUN apt-get update && apt-get install -y python3
RUN npm install

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

RUN apt install python3.11-venv -y
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 3000

CMD ["npm", "run", "start"]
