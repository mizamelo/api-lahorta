FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Copy app dependencies
COPY . .

# Install app dependencies
# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Install Sequelize-cli
RUN npm install -g sequelize-cli

# Run all migrations
RUN sequelize db:migrate:undo:all && sequelize db:migrate

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
