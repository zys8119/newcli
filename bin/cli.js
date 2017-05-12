#!/usr/bin/env node
/**
 * 脚手架 by 张云山 on 2017/5/11.
 */
const fs = require('fs');
const dirPath = process.cwd();
const argvss = process.argv.slice(2);
const fileDependenciesName = "newcli.json";//存储依赖包的文件名
const fileDependenciesPath = __dirname+"\\"+fileDependenciesName;//存储依赖包的文件路径
function Cli() {
    this.argvss = argvss;//命令参数；
    this.fileDependenciesName = fileDependenciesName;
    this.fileDependenciesPath = fileDependenciesPath;
}
Cli.prototype = {
    createCLI:function (dirName,cmd) {
        dirName = dirName || "myApp";//默认创建myApp项目；
        cmd = cmd || 'CHCP 65001 && echo 【暂无cmd命令，可设置cmd命令】';
        if(!fs.existsSync(dirPath+"\\"+ dirName)){
            fs.mkdir(dirPath+"\\"+ dirName);
            fs.mkdir(dirPath+"\\"+ dirName+"\\node_modules");
        };
        this.publicCLI(dirName,cmd);
    },
    publicCLI:function (dirName,cmd) {
        if(cmd === true);{
            var package = require("../package.json");
            package.dependencies = (function () {
                if(fs.existsSync(fileDependenciesPath) && require(fileDependenciesPath)[0]){
                    var jsons = require(fileDependenciesPath)[0].data || [];
                    var data = {};
                    for(var i = 0,len = jsons.length;i<len; i++){
                        data[jsons[i]] = '';
                    };
                    return data;
                }
            })()||{};//依赖包
            console.log("正在安装依赖包，请稍等.....");
            cmd = `CHCP 65001 &&　cd `+dirName+` && echo `+JSON.stringify(package)+`>package.json && npm i`;//cmd命令行
        }
        var shell = require('shelljs');
        shell.exec(cmd);
        console.log("初始化完成！")
    }
}
exports = module.exports = new Cli();