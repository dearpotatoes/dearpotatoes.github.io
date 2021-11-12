var courseSumNumber=0;
var backPackArray=['white','black']
var backpack={
'1':'black',
'0':'white',
};//创建一个对象，其中‘1’属性值对应‘black’，‘0’属性值对应‘white’
var mainArray=[];//创建的总数组，记录每次的点击数据
mainArray.push([1,1,1,1,1,1,1]);//给数组加上一个初始状态
window.onload=function () {
var divSet=document.querySelectorAll('div#container div');// 获得每个块的引用，方便接下来访问每个块
for(var i=0;i<3;i++){  //为前3个块依次增加事件处理程序
divSet[i].onclick=sevenPointCircle1;//增加的事件处理程序为sevenPointCircle
}

divSet[3].onclick=sevenPointCircle2;//单独为第4个块增加事件处理程序

for(var i=4;i<7;i++){  //为后3个块依次增加事件处理程序
divSet[i].onclick=sevenPointCircle3;//增加的事件处理程序为sevenPointCircle
}

//退出按钮的点击程序
document.getElementsByTagName('button')[1].onclick=function () {
window.close();//退出该游戏界面
}

//返回上一步的程序
document.getElementsByTagName('button')[0].onclick=back;

console.log(mainArray);
};

//事件处理程序1如下：
function sevenPointCircle1(event) {
var divSet=document.querySelectorAll('div#container div');
var selected=event.target;//获得触发该事件的元素
if(selected.getAttribute('class').indexOf('1')>-1){//只对黑色的按钮做出反映
styleProcess(selected);//调用样式处理程序来改变该元素的样式
var order=parseInt(selected.getAttribute('id'));//获得它的‘id’值，其与该元素在divSet数组的位置相对应
styleProcess(divSet[order+3]);//改变后边第3个元素的样式
styleProcess(divSet[order+4]);//改变后边第3个元素的样式
courseSum(1);
setArray();
}
}

//事件处理程序2如下：
function sevenPointCircle2(event) {
var divSet=document.querySelectorAll('div#container div');
var selected=event.target;//获得触发该事件的元素
if(selected.getAttribute('class').indexOf('1')>-1){//只对黑色的按钮做出反映
styleProcess(selected);
styleProcess(divSet[6]);//改变第7个元素的样式
styleProcess(divSet[0]);//改变第1个元素的样式(元素的循序号比它在数组中的索引号多1)
courseSum(1);
setArray();
}
}

//事件处理程序3如下：
function sevenPointCircle3(event) {
var divSet=document.querySelectorAll('div#container div');
var selected=event.target;//获得触发该事件的元素
if(selected.getAttribute('class').indexOf('1')>-1){//只对黑色的按钮做出反映
styleProcess(selected);
var order=parseInt(selected.getAttribute('id'));//获得它的‘id’值，其与该元素在divSet数组的位置相对应
styleProcess(divSet[order-4]);//改变右边相隔两个元素的样式，超过结束位置从起点开始
styleProcess(divSet[order-3]);//改变右边相隔三个元素的样式，超过结束位置从起点开始
courseSum(1);
setArray();
}
}

//样式变化处理程序
function styleProcess(element) {
if(element.getAttribute('class').indexOf('1')>-1){//查看元素的类名中是否存在字符串‘1’。若存在
element.style.backgroundColor=backpack['0'];//元素背景颜色变化
element.setAttribute('class','white0');//类名设置为‘white0’
} else {
element.style.backgroundColor=backpack['1'];
element.setAttribute('class','black1');
}
}

//记录点击次数的程序
function courseSum(bool) {
courseSumNumber+=bool;
var span=document.getElementById('log');
span.innerHTML=courseSumNumber;
}

//点击就获得数据并添加至总数组中的程序
function setArray() {
var childArray=[];
var divSet=document.querySelectorAll('div#container div');
for(var i=0;i<divSet.length;i++){
childArray.push(parseInt(divSet[i].getAttribute('class').slice(-1)));
}
var sum=0;
for(var i=0;i<7;i++) {
sum+=childArray[i];
}
if(sum==0){
alert('恭喜你\n🐂🐂🐂🐂🐂\n👍👍👍👍👍👍👍');
}
mainArray.push(childArray);
console.log(mainArray);
}

//返回上一步的程序
function back() {
var backArray=mainArray[mainArray.length-2];
var divSet=document.querySelectorAll('div#container div');
for(var i=0;i<7;i++){
var index=backArray[i];
divSet[i].style.backgroundColor=backPackArray[index];
attribute=backpack[index.toString()]+index;
divSet[i].setAttribute('class',attribute);
}
mainArray.pop(mainArray[mainArray.length-1]);
console.log(mainArray);
courseSum(-1);
}

//完成关卡后弹出的一个提示窗口