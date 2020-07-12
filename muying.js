const http = require('https');
const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');

var html = fs.readFileSync("muying.html",'utf-8');
var output = []
var $ = cheerio.load(html);
  $('body').find($('.poem'))
.each(function(i, elem) {
  var time = $(this).children('time').text();
  var title=$(this).children('a').attr("title")
  var pre = $(this).children('pre').text()
  output.push({"time":time,"title":title,"pre":pre});
});
var content ='# 木莺\n<font size = 3>作者[赵坤](http://xn--tfs117j.cn/)</font>\n'
output.forEach(elem=>{
  content+='## '+elem.title+'\n';
  content+='<font size = 2>'+elem.time+'</font>\n';
  content+='<pre>'+elem.pre+'</pre>\n';
});
fs.writeFile(path.join('./modules/literature/muying.md'), content, 'utf8', function (error) {
  if (error) {
    console.log("写入文件错误");
    console.log(error);
    return false;
  }
})