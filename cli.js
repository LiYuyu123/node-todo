#!/usr/bin/env node

const program=require('commander')
const api=require('./index')
const pak=require('./package.json')
program
    .version(pak.version)
    .option('-x, --xx', 'what the x')
program
    .command('add')
    .description('添加一个任务')
    .action((...args) => {
        let word=args.slice(0,-1).join(' ')
       api.add(word).then(()=>{console.log('添加成功')},()=>{console.log('添加失败')})
    });
program
    .command('clear')
    .description('clear all tasks')
    .action((...args) => {
     api.clear().then(()=>{console.log('清除成功')},()=>{console.log('清除失败')})
    });
program.parse(process.argv);

if(process.argv.length===2){
    //说明用户直接运行node cli
    api.showAll()
}