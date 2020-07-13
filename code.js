const axios = require('axios').default;
const fs = require("fs");
var path = require("path");
function decode(e) {
  try {
    for (var i = e.charCodeAt(0), t = "", o = 1; o < e.length; o++) {
      var n = decodeRoman(e[o].charCodeAt(0), i);
      t += String.fromCharCode(n)
    }
    return decodeURIComponent(t)
  } catch (r) {
    return '<p style="color: red;">这条数据过长，无法正常显示</p>'
  }
}


function encodeRoman(e, i) {
  return e + i <= 126 ? e + i : e + i - 126 + 31
}
function decodeRoman(e, i) {
  return e - i >= 32 ? e - i : e - i + 126 - 31
}

function encode(e) {
  for (var i = encodeURIComponent(e), t = parseInt(26 * Math.random() + 65, 10), o = String.fromCharCode(t), n = 0; n < i.length; n++) {
    var r = encodeRoman(i[n].charCodeAt(0), t);
    o += String.fromCharCode(r)
  }
  return o
}

function readFile(title) {
  return fs.readFileSync(path.join(parentDir, title), 'utf-8')
}

function writeFile(title, content) {
  fs.writeFile(path.join(parentDir, title), content, 'utf8', function (error) {
    if (error) {
      console.log("写入文件错误" + title);
      console.log(error);
      return false;
    }
    console.log('写入成功' + path.join(parentDir, title));
  })
}
var parentDir = './modules/hidden/'
var files = fs.readdirSync(parentDir)
function encodeFile() {
  files.forEach(f => {
    if (f !== 'README.md') {
      writeFile(f, encode(readFile(f)))
    }
  })
}

function decodeFile() {
  files.forEach(f => {
    if (f !== 'README.md') {
      writeFile(f, decode(readFile(f)))
    }
  })
}

encodeFile() 
// decodeFile()

