#!/bin/sh

pm2 delete SCAffold-API
pm2 start api/launch.js --watch --ignore-watch="\.log$ \.sh$" --name SCAffold-API

pm2 delete SCAffold-UI
pm2 start ui/server.js --watch --ignore-watch="\.log$ \.sh$" --name SCAffold-UI
pm2 logs