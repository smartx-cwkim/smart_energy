FROM resin/rpi-raspbian:wheezy

# install
RUN	sudo apt-get update
RUN	sudo apt-get install -y nodejs npm
RUN	mkdir /src
COPY	. /src

# Install app dependencies
RUN	cd /src


#CMD ["nodejs", "/src/server.js"]
