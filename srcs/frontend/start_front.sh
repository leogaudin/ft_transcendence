#!/bin/sh
npm i
supervisord -c /etc/supervisor.conf
