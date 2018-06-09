#!/bin/bash
dir=`dirname $0`
name=`cat ${dir}/config/server.json | jq -r '.name'`
port=`cat ${dir}/config/server.json | jq -r '.port'`

docker build -t $name $dir --build-arg port=$port
docker stop -t 0 $name
docker rm $name
docker run -d -it -p $port:$port --name $name $name
