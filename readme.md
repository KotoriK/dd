## 要求
* 你的node要能支持ES Module，即在v12以上
* 有一个onebot http服务器
## 部署
```
git clone https://github.com/KotoriK/dd
npm i
npx pm2 start ecosystem.config.js
```
JSON文件应该会自动创建并填充默认值