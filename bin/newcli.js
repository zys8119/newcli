#!/usr/bin/env node
const fs= require("fs");
const program = require('commander');
const cli = require('./cli');
const option = {
    "init":{
        fn:function(){
            publicFn(function () {
                this.createCLI(this.argvss[1],true);
            },function () {
                this.createCLI(false,true);
            })
        },
        Explain:{
            option:"<projectName>",
            txt:"初始化项目，后面参数可选，默认生成名为myApp的项目包"
        }
    },
    "new":{
        fn:function(){
            publicFn(function () {
                this.createCLI(this.argvss[1],true);
            },function () {
                console.log("项目名称不能为空！");
            })
        },
        Explain:{
            option:"<projectName>",
            txt:"初始化项目，后面参数必填，生成对应的项目包"
        }
    },
    "config":{
        fn:function () {
            function add() {
                console.log("\n\n选项：");
                console.log("      -h",""," 帮助");
                console.log("      -m","<projectName>||<projectNumber>"," 切换脚手架，默认执行第一个项目,查看项目请使用【ls】选项");
                console.log("      add","<dependenciesName>"," 添加依赖包,以空格隔开，其中选项参数【-m <projectName> <Explain>】，添加当前项目包的名称与描述,参数可选");
                console.log("      ls",""," 查看现有所有项目包");
                console.log("      rm","<projectName>||<@projectNumber>"," 删除项目，其中选项参数【-all】，删除所有项目");
            }
            var dependenciesName = process.argv.slice(3);
            if(dependenciesName[0] == "-h" || dependenciesName[0] == "--help" || dependenciesName[0] == "help"){//帮助
                add();
            }else if(dependenciesName[0] == "add"){
                var dependenciesNameObj = process.argv.slice(4);
                var index = false ;
                var name = false;
                var Explain = '';
                for(var i = 0,len = dependenciesNameObj.length;i<len;i++){
                    if(dependenciesNameObj[i] == "-m"){
                        index = i;
                    }
                }
                if(index){
                    var name_M = process.argv.slice(4+index+1);
                    if(name_M[0]){
                        name = name_M[0];
                        if(name_M[1]) {
                            Explain = (function (e) {
                                var txt = '';
                                e.slice(1).map(function (t) {
                                    txt += t;
                                });
                                return txt;
                            })(name_M);
                        }
                    }
                }
                if(dependenciesNameObj.length > 0){
                    var bool = false;
                    var addIndex = 0;
                    var addData = [];
                    if(fs.existsSync(cli.fileDependenciesPath)){
                        bool == true;
                        addData = require(cli.fileDependenciesPath);
                    }
                    if(dependenciesNameObj[1]) {
                        addIndex = dependenciesNameObj[1];
                    }else{
                        addIndex = addData.length;
                    };
                    addData.push({
                        name:(function (name) {
                            if(name === false){
                                if(fs.existsSync(cli.fileDependenciesPath)){
                                    var fileDependenciesPath = require(cli.fileDependenciesPath);
                                    if(bool){
                                        return fileDependenciesPath.length;
                                    }
                                    if(fileDependenciesPath.length > 0){
                                        for(var j = 0 ,len = fileDependenciesPath.length; j < len ;j++){
                                            if(fileDependenciesPath[j].name == addIndex){
                                                console.log("添加失败！【"+addIndex+"】项目包已存在,请使用选项【ls】查看项目包详情")
                                                add();
                                                process.exit();//退出
                                                break;
                                            };
                                        };
                                    };
                                };
                                return addIndex;
                            }
                            return name;
                        })(name),
                        data:(function (data,index) {
                            if(index === false){
                                return data
                            };
                            return data.slice(0,index);
                        })(dependenciesNameObj,index),
                        Explain:Explain
                    });
                    fs.writeFileSync(cli.fileDependenciesPath,JSON.stringify(addData), 'utf8', function(err) {
                            if (err) throw err;
                        console.log('The file has been saved!');
                    });
                    console.log("项目添加成功！");
                }else{
                    console.log("错误提示：依赖包为空！")
                    add();
                }
            }else if(dependenciesName[0] == "ls") {
                if(fs.existsSync(cli.fileDependenciesPath)){
                    var fileDependenciesData = require(cli.fileDependenciesPath);
                    if(fileDependenciesData.length > 0 ){
                        console.log("以下共有："+fileDependenciesData.length+"个项目");
                        for(var i = 0,len = fileDependenciesData.length;i<len;i++){
                          console.log(fileDependenciesData[i]);
                        };
                    }else{
                        console.log("暂无项目包，您可以使用【add】选项添加项目包");
                        add();
                    }
                }else{
                    console.log("暂无项目包，您可以使用【add】选项添加项目包");
                    add();
                }
            }else if(dependenciesName[0] == "rm") {
                var dependenciesNameObj = process.argv.slice(4);
                if(fs.existsSync(cli.fileDependenciesPath)){
                    var fileDependenciesData = require(cli.fileDependenciesPath);
                    if(fileDependenciesData.length > 0 && dependenciesNameObj.length > 0){
                        var bool = true;
                        for(var i = 0 ,len = fileDependenciesData.length ; i < len ;i++){
                            var project = fileDependenciesData[i];
                            if(dependenciesNameObj[0] == "-all"){
                                fs.writeFileSync(cli.fileDependenciesPath,JSON.stringify([]), 'utf8', function(err) {
                                    if (err) throw err;
                                    console.log('The file has been saved!');
                                });
                                console.log("已删除所有项目！");
                                process.exit();//退出
                                break;
                            }
                            if(project.name.toString() == dependenciesNameObj[0] || dependenciesNameObj[0].indexOf("@") == 0 && parseInt(dependenciesNameObj[0].replace(/^@/,"")) == i){
                                bool = false;
                                fileDependenciesData.splice(i,1);
                                fs.writeFileSync(cli.fileDependenciesPath,JSON.stringify(fileDependenciesData), 'utf8', function(err) {
                                    if (err) throw err;
                                    console.log('The file has been saved!');
                                });
                                console.log("项目删除成功！");
                                break;
                            }
                        }
                        if(bool){
                            console.log("项目包不存在，请使用选项【ls】查看项目包");
                            add();
                        }
                    }else{
                        console.log("项目包名称或项目Number不能为空");
                        add();
                    }
                }else{
                    console.log("提示：无法删除！");
                    console.log("原因：暂无项目包，您可以使用【add】选项添加项目包");
                }
            }else if(dependenciesName[0] == "-m") {
                var tabProjectName = process.argv.slice(4)[0];
                if(tabProjectName){
                    if(fs.existsSync(cli.fileDependenciesPath)){
                        var fileDependenciesData = require(cli.fileDependenciesPath);
                        if(fileDependenciesData.length > 0 ){
                            var bool = true;
                            for(var i = 0,len = fileDependenciesData.length;i<len;i++){
                                if(fileDependenciesData[i].name.toString() == tabProjectName ||
                                    tabProjectName.indexOf("@") == 0 &&
                                    parseInt(tabProjectName.replace(/^@/,"")) == i){
                                            bool = false;
                                            var tabProjectNameObj = fileDependenciesData[i];
                                            fileDependenciesData.splice(i,1);
                                            fileDependenciesData.splice(0,0,tabProjectNameObj)
                                            fs.writeFileSync(cli.fileDependenciesPath,JSON.stringify(fileDependenciesData), 'utf8', function(err) {
                                                if (err) throw err;
                                                console.log('The file has been saved!');
                                            });
                                            console.log("项目包设置成功！，当前项目包为："+tabProjectName);
                                            break;
                                }
                            };
                            if(bool){
                                console.log("项目包不存在，请使用选项【ls】查看项目包");
                                add();
                            }
                        }else{
                            console.log("暂无项目包，您可以使用【add】选项添加项目包");
                            add();
                        }
                    }else{
                        console.log("暂无项目包，您可以使用【add】选项添加项目包");
                        add();
                    }
                }else{
                    console.log("项目包名称或项目Number不能为空");
                    add();
                }
            }else {
                add();
            }
            process.exit();//退出
        },
        Explain:{
            option:"<dependenciesName>Name Name ...",
            txt:"可选，配置依赖包，后面参数为项目依赖包，包名以空格分隔"
        }
    }
};
function publicFn(fn1,fn2) {
    fn1 = fn1 || new Function();
    fn2 = fn2 || new Function();
    if(cli.argvss[1]){
        //有参数
        fn1.call(cli);
    }else{
        //无参数
        fn2.call(cli);
    };
    process.exit();//退出
}
program.version(require("../package.json").version);
for(var i in option){
    if(cli.argvss[0] == i){
        option[i].fn();
    };
    program.option(i+(function (e) {
            if(e.Explain.option){
                return " "+e.Explain.option;
            }
            return "";
    })(option[i]),(function (e) {
            if(e.Explain.txt){
                return " "+e.Explain.txt;
            }
            return "";
    })(option[i]));
};
program.parse(process.argv);

console.log(' 插件描述:',"\n        1、这是一个自定义脚手架插件；\n        2、可实现快速搭建项目，便于项目开发；\n        3、可扩展。");
console.log(' 帮助提示:',"\n        请执行【--help】或【-h】选项");
console.log(' 查看当前版本号:',"\n        请执行【--version】或【-V】选项");