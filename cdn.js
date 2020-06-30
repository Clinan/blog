const qiniu = require("qiniu");
const proc = require("process");
const path = require("path");
const fs = require("fs");
var bucket = proc.env.QINIU_BUCKET;
var accessKey = proc.env.QINIU_ACCESS_KEY;
var secretKey = proc.env.QINIU_SECRET_KEY;
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
  scope: bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);

var uploadToken = putPolicy.uploadToken(mac);
var config = new qiniu.conf.Config();
// config.zone = qiniu.zone.Zone_z0;
var formUploader = new qiniu.form_up.FormUploader(config);
// var putExtra = new qiniu.form_up.PutExtra();

var __dirname = "./";
var excludeSubDir = ["node_modules", ".git", "dist", "theme"];
var imageExtName = [".jpg", ".JPG", ".PNG", ".png", ".JPEG", ".ico", ".jpeg"];

function upload(fullPath) {
  formUploader.putFile(
    uploadToken,
    path.basename(fullPath),
    fullPath,
    null,
    function (respErr, respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }

      if (respInfo.statusCode == 200) {
        console.log(respBody.key);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    }
  );
}

function readFileList(dir, filesList = [], existFiles = []) {
  const files = fs.readdirSync(dir);
  // console.log(files);
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !excludeSubDir.includes(item)) {
      readFileList(path.join(dir, item), filesList); //递归读取文件
    } else if (
      !excludeSubDir.includes(item) &&
      imageExtName.includes(path.extname(item)) &&
      !existFiles.includes(path.extname(item))
    ) {
      upload(fullPath);
      filesList.push(fullPath);
    }
  });
  return filesList;
}

var bucketManager = new qiniu.rs.BucketManager(mac, config);
bucketManager.listPrefix(bucket, null, function (respErr, respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }
  if (respInfo.statusCode == 200) {
    // console.log(respBody);
    var existFiles = respBody.items.map((v) => v.key);
    var filesList = [];
    console.log("start upload");
    readFileList(__dirname, filesList, existFiles);
    // console.log(filesList.map((v) => path.basename(v)));
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
});
