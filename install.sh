#!/bin/bash
echo Script de instalação iniciado!

cd lambda-techtalk-shared-libs
npm install &
wait

cd ../microservices/audiovisual-type
npm install &

cd ../cast
npm install &
wait

cd ../genre
npm install &

cd ../production
npm install &
wait 

cd ../user
npm install &

cd ../../express-app
npm install &
wait 

echo Script de instalação finalizado!