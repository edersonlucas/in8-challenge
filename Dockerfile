FROM node:lts-slim

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /backend

COPY . .

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && mkdir -p /backend/node_modules \
    && mkdir -p /backend/build \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /backend/node_modules \
    && chown -R pptruser:pptruser /backend/package.json \
    && chown -R pptruser:pptruser /backend/package-lock.json \
    && chown -R pptruser:pptruser /backend/build

USER pptruser

RUN ["npm", "install"]

RUN ["npm", "run", "build"]

CMD ["npm", "start"]