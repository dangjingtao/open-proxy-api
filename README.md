# open-proxy-api

[![](https://img.shields.io/github/license/dangjingtao/open-proxy-api.svg)](LICENSE)
![](https://img.shields.io/github/stars/dangjingtao/open-proxy-api.svg)
![](https://img.shields.io/github/forks/dangjingtao/open-proxy-api.svg)
![](https://img.shields.io/docker/pulls/tomz2024/open-proxy-api.svg)

[toc]

## Disclaimer

The disclaimer states that this is for personal use only， if you like the service, you can pay to use it on the official website.

## Description

Supported AI Service Providers

| Service Provider |      |      |      |
| ---------------- | ---- | ---- | ---- |
| qwen             |      |      |      |
| kimi             |      |      |      |
| deepseek         |      |      |      |
|                  |      |      |      |

## Environment variables

| Name | Optional | Remarks                         |
|------|------|----------------------------------|
| QWEN_AUTHORIZATION | Y | Bearer + {API_KEY} |
| KIMI_AUTHORIZATION | Y | Bearer + {API_KEY} |
| DEEPSEEK_AUTHORIZATION | Y | Bearer + {API_KEY} |

Multi-accounts:

```
Bearer TOKEN1,TOKEN2,TOKEN3
```

## Deploy via Docker 

Please prepare a server with a public IP address and open port 5090.  Pull the image and start the service.

```shell
docker pull tomz2024/open-proxy-api:latest
```

```shell
docker run -it -d --init --name open-proxy-api -p 5090:5090 -e TZ=Asia/Shanghai  tomz2024/open-proxy-api:latest
# or configure the token in the environment variables
docker run -it -d --init --name open-proxy-api -p 5090:5090 -e TZ=Asia/Shanghai -e QWEN_AUTHORIZATION=xxx KIMI_AUTHORIZATION=yyy DEEPSEEK_AUTHORIZATION=zzzb -d tomz2024/open-proxy-api:latest
```

```shell
# View service real-time logs
docker logs -f open-proxy-api
# Restart the service
docker restart open-proxy-api
# docker stop open-proxy-api
docker stop open-proxy-api
```

### Deploy via Docker-compose 

```yaml
version: '3'

services:
  open-proxy-api:
    container_name: open-proxy-api
    image: tomz2024/open-proxy-api:latest
    restart: always
    ports:
      - "5090:5090"
    environment:
      - TZ=Asia/Shanghai
      - QWEN_AUTHORIZATION=xxx
      - KIMI_AUTHORIZATION=yyy
      - DEEPSEEK_AUTHORIZATION=zzz
```

## Manual deployment

**Manually deploy the API on a public IP server that has port 5090 opened.**
Please install Node.js and set up environment variables before running Node.js commands. Make sure the `node` command is available.
Install dependencies

```
npm i
```
Install PM2 to process manage the application
```
npm i -g pm2
```
Build the application by going to dist directory
```
npm run build
```
Start the service
```
pm2 start dist/index.js --name "open-proxy-api"
```
View real-time logs of the service
```
pm2 logs open-proxy-api
```
Reload the application
```
pm2 reload open-proxy-api
```
Stop the application
```
pm2 stop open-proxy-api
```



## Star History

![Star History Chart](https://api.star-history.com/svg?repos=dangjingtao/open-proxy-api&type=Date)