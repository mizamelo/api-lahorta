#!/bin/sh

if [ "$NODE_ENV" == "production" ] : then
  npm start
else
  # Install Sequelize-cli
  npm install -g sequelize-cli

  # Run all migrations
  sequelize db:migrate:undo:all && sequelize db:migrate

  # Starting
  npm dev
fi