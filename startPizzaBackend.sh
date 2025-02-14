#!/bin/bash

docker run -p 5000:5000 --env PORT=5000 -v ./db:/app/db pizza-tracker-server