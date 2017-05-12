#newcli
>初始化自定义脚手架
##安装
```angular2html
npm i [-g] newcli
```
##初始化
选项：

+ [ -v ] & &//版本号
+ [ -h ] & &//帮助选项
+ [ init ] & &//后面参数可选，默认生成名为myApp的项目包
+ [ new ] & &//后面参数必填，生成对应的项目包
+ [ config ] & &//可选，配置依赖包，后面参数为项目依赖包，包名以空格分隔
   > [ -h ] & &//帮助选项
   > [ -m ] & &//<projectName>||<projectNumber>  切换脚手架，默认执行第一个项目,查看项目请使用【ls】选项
   > [ add ] & &//<dependenciesName>  添加依赖包,以空格隔开，其中选项参数【-m <projectName> <Explain>】，添加当前项目包的名称与描述,参数可选
   > [ ls ] & &//查看现有所有项目包
   > [ rm ] & &//<projectName>||<@projectNumber>  删除项目，其中选项参数【-all】，删除所有项目

```angular2html
newcli [init/new] <dirName>
```
##示例
>配置脚手架项目包
```angular2html
//添加项目依赖包
newcli config add jquery
.....
//添加项目依赖包并添加名称以及项目包说明
newcli config add jquery -m jquery 这是一款非优秀的DOM操作的javascript库。
//查看所有项目依赖包
newcli config ls
//删除项目依赖包
newcli config rm jquery
//删除所有项目依赖包
newcli config rm -all
//切换项目包
newcli config -m jquery
```
>创建脚手架
```angular2html
//初始化myApp项目
newcli init 
//初始化并自定义test项目
newcli init test 
//新建test1项目
newcli new test1 
```