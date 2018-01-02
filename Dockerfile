FROM ubuntu-debootstrap:14.04
ARG port

# Install FFMPEG, Node, and NPM
WORKDIR /build
RUN apt-get update -q && \
	DEBIAN_FRONTEND=noninteractive apt-get install -qy software-properties-common build-essential curl npm && \
	\
	add-apt-repository ppa:mc3man/trusty-media && \
	apt-get update && \
	apt-get install -y ffmpeg && \
	\
	v=8 && curl -sL https://deb.nodesource.com/setup_$v.x | bash - && \
	apt-get install -y nodejs

# Build and run server
WORKDIR /bot
COPY package.json /bot
RUN npm i
COPY . /bot
CMD node app.js
EXPOSE $port
