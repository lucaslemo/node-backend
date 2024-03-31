#!/bin/bash

cp -r /usr/src/cache/node_modules /usr/src/app/node_modules
cp -r /usr/src/cache/package-lock.json /usr/src/app/
# exec npm --prefix /usr/src/app run migrate
exec npm --prefix /usr/src/app run dev