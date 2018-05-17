#!/bin/bash
echo Script de deploy iniciado!

cd microservices

cd audiovisual-type
npm run deploy &

cd ../cast
npm run deploy &
wait

cd ../genre
npm run deploy &

cd ../production
npm run deploy &
wait 

cd ../user
npm run deploy &

wait 

echo Script de deploy finalizado!