const db=require('./db')
const inquirer = require('inquirer');

module.exports.add=async (title)=>{
    //读取文件
    const list =await db.read()
    //添加任务
    list.push({title,done:false})
    //存储任务到文件
   await db.write(list)


}


module.exports.clear=async ()=>{
   await db.write([])
}
function askForCreateTask(list){
    inquirer.prompt(  {
        type: 'input',
        name: 'title',
        message: "输入任务标题",
    }).then((answers) => {
        list.push({
            title:answers.title,
            done:false
        })
        db.write(list).then(()=>{console.log('创建成功')},()=>{console.log('创建失败')})
    });
}
function markAsDone(list,index){
    list[index].done=true
    db.write(list).then(()=>{console.log('标记成功')},()=>{console.log('标记失败')})
}
function markAsUnDone(list,index){
    list[index].done=false
    db.write(list).then(()=>{console.log('标记成功')},()=>{console.log('标记失败')})
}
function updateTitle(list,index){
    inquirer.prompt(  {
        type: 'input',
        name: 'title',
        message: "新的标题",
        default:list[index].title
    }).then((answers) => {
        list[index].title=answers.title
        db.write(list).then(()=>{console.log('改写成功')},()=>{console.log('改写失败')})
    });
}
function remove(list,index){
    list.splice(index,1)
    db.write(list).then(()=>{console.log('删除成功')},()=>{console.log('删除失败')})
}
function askForAction(list,index){
    const actions={markAsDone, markAsUnDone, updateTitle, remove}
    inquirer.prompt({
            type: 'list',
            name: 'action',
            message: '请选择操作',
            choices: [
                {name:'退出',value:'quit'},
                {name:'已完成',value:'markAsDone'},
                {name:'未完成',value:'markAsUnDone'},
                {name:'改标题',value:'updateTitle'},
                {name:'删除',value:'remove'},
            ],
        },
    ).then(answer2=>{
        const action=actions[answer2.action]
        action && action(list,index)
    })
}
function printTasks(list){
    inquirer
        .prompt({
                type: 'list',
                name: 'index',
                message: '你想操作的任务',
                choices: [{name:'退出',value:'-1'},...list.map((i,index)=>{
                    return {name:`${i.done ? '[x]':'[_]'} ${index+1} - ${i.title}`,value:index.toString()}
                }),{name:'+创建任务 ',value:'-2'}],
            },
        )
        .then((answer) => {
            const index = parseInt(answer.index)
            if(index>=0){
                //选中一个任务
              askForAction(list,index)
            }else if(index===-2){
                //创建任务
                askForCreateTask(list)
            }
        })
}
module.exports.showAll=async ()=>{
    //读取之前的任务
    const list =await db.read()
    //打印之前的任务
    printTasks(list)


}
