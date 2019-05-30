FROM node:10

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm ci

# Copy app dependencies
COPY . .

EXPOSE 3000

CMD ./scripts.sh
