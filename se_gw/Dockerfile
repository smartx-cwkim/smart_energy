FROM ubuntu:14.04

# install
RUN	sudo apt-get update
RUN	sudo apt-get install -y vim
RUN	sudo apt-get install -y nodejs npm
RUN	mkdir /src
COPY	. /src

# Install app dependencieied
RUN	cd /src

#CMD ["nodejs", "/src/server.js"]
