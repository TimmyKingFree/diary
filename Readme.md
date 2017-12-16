### 项目相关：
* 项目依赖node.js 的express框架，需要配置相关环境
* 启动项目前需先执行指令： 
    
    npm install
### 文件格式需要如下：
```
### 日期

2017-12-13

### 工作内容
    1、做了XXX
    2、开了xxx会

### 明日计划
    1、计划做XXX
    2、计划做XXX
```
### 输出如下：
日期 |  工作内容 |  明日计划
---|---|---
2017-12-13 |     1、做了XXX |     1、计划做XXX
|     |     2、开了xxx会 |     2、计划做XXX
### 使用方法：
* 进入项目目录，运行项目：

    node index.js
* 项目监听3000端口，若执行过中有冲突请自行更改。
* 生成的输出文件在项目的result文件夹中
