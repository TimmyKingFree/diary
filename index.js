var express = require('express');
var app = express();

app.use(express.static('src'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
var multer = require('multer');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var util = require('util');
var fs = require('fs');

// 路由拦截
app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// 文件上传
app.post('/file-upload', multipartMiddleware, function (req, res) {
  console.log(req.body, req.files);
  // don't forget to delete all req.files when done 
  // 获得文件的临时路径
  var tmp_path = req.files.thumbnail.path;
  // 指定文件上传后的目录 - 示例为"images"目录。 
  var target_path = './output/' + req.files.thumbnail.name;
  // 移动文件
  fs.rename(tmp_path, target_path, function (err) {
    if (err) throw err;
  });
  fs.readFile('./output/' + req.files.thumbnail.name, function (err, data) {
    if (err) {
      return console.error(err);
    }
    let fileStr = data.toString();
    let fileItems = fileStr.split('###').filter(function (cur, index, arr) {
      return cur !== '\n';
    });
    let file_arr = fileItems.map(function (cur, index, arr) {
      return cur.split('\n').filter(function (cur, index, arr) {
        return cur !== '';
      });
    });
    // console.log(file_arr);
    let result_arr = [];
    console.log(file_arr);
    let tmpArrLen = [];
    let matchLen = 0;
    let resultStrArr = [];
    let resultDevideArr = [];
    let finalResult = '';
    file_arr.forEach(function (cur, index, arr) {
      tmpArrLen.push(cur.length);
      resultDevideArr.push('---');
    });
    console.log(resultDevideArr);
    // console.log(tmpArrLen);
    matchLen = tmpArrLen.sort()[tmpArrLen.length - 1];
    for (let i = 0; i < matchLen; i++) {
      let tmpArr = [];
      for (let j = 0; j < file_arr.length; j++) {
        opt = file_arr[j][i] || '|    ';
        tmpArr.push(opt);
      }
      result_arr.push(tmpArr);
    }
    console.log(result_arr);
    for (let i = 0; i < result_arr.length; i++) {
      let tmpStr = '';
      tmpStr = result_arr[i].join(' | ');
      resultStrArr.push(tmpStr);
    }
    resultStrArr.splice(1, 0, resultDevideArr.join('|'));
    finalResult = resultStrArr.join('\n');
    // 创建一个可以写入的流，写入到文件 output.txt 中
    let writerStream = fs.createWriteStream('./result/' + req.files.thumbnail.name);
    // 使用 utf8 编码写入数据
    writerStream.write(finalResult, 'UTF8');
    // 标记文件末尾
    writerStream.end();
    // 处理流事件 --> data, end, and error
    writerStream.on('finish', function () {
      console.log("写入完成。");
    });
    writerStream.on('error', function (err) {
      console.log(err.stack);
    });
    // 删除临时文件夹文件, 
    fs.unlink(tmp_path, function () {
      if (err) throw err;
      res.send('File uploaded to: ' + './result/' + ' - ' + req.files.thumbnail.size + ' bytes');
    });
  });
});