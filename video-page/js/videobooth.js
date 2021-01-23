var videos={video1:'video-page/video/sintel',video2:'video-page/video/HILDA'};
var effectFunction=null;
window.onload=function () {

var video=document.getElementById('video');

video.src=videos.video1+getFormatExtension();
video.load();

drawImage()[0].putImageData(drawImage()[1],0,0);

var controlLinks=document.querySelectorAll('a.control');
for(var i=0;i<controlLinks.length;i++){
controlLinks[i].onclick=handleControl;
}

var effectLinks=document.querySelectorAll('a.effect');
for(var i=0;i<effectLinks.length;i++){
effectLinks[i].onclick=setEffect;
}

var videoLinks=document.querySelectorAll('a.videoSelection');
for(var i=0;i<videoLinks.length;i++){
videoLinks[i].onclick=setVideo;
}

pushUnpushButtons('video1',[]);
pushUnpushButtons('normal',[]);

/* 视频播完触发ended事件,调用函数改变按钮图形 */
video.addEventListener('ended',endedHandler,false);
video.addEventListener('play',processFrame,false);
}

/* 视频播完后的按钮图形处理程序 */
function endedHandler() {
pushUnpushButtons('',['play']);
}

/* 画布捕获，视频未加载时没有获得任何数据 ，所以没有画出第一帧*/
function drawImage() {
var bufferCanvas=document.getElementById('buffer');
var displayCanvas=document.getElementById('display');
var buffer=bufferCanvas.getContext('2d');
var display=displayCanvas.getContext('2d');
buffer.drawImage(video,0,0,bufferCanvas.width,bufferCanvas.height);
var frame=buffer.getImageData(0,0,bufferCanvas.width,bufferCanvas.height);
return [display,frame];
}

/* 视频效果处理函数 */
function processFrame() {
var video=document.getElementById('video');
if(video.paused||video.ended){
return ;
}
display=drawImage()[0];
frame=drawImage()[1];
var length=frame.data.length/4;

for(var i=0;i<length;i++){
var r=frame.data[i*4+0];
var g=frame.data[i*4+1];
var b=frame.data[i*4+2];
if(effectFunction){
effectFunction(i,r,g,b,frame.data);
}
}
display.putImageData(frame,0,0);
setTimeout(processFrame,0);
}

/* handleControl处理程序,图形外观上的处理 */
function handleControl(e){
var id=e.target.getAttribute('id');
var video=document.getElementById('video');//该函数未调用时不需要知道video元素是什么，一开始页面加载时未调用该函数，故这里未产生错误。
// 实现播放的功能
if(id=='play'){
pushUnpushButtons('play',['pause']);
if(video.ended){
video.load();
}
video.play();

} else if (id=='pause'){
pushUnpushButtons('pause',['play']);
video.pause();// 暂停播放的功能

} else if (id=='loop'){
if(isButtonPushed('loop')){
pushUnpushButtons('',['loop']);
} else {
pushUnpushButtons('loop',[]);
}
video.loop=!video.loop;

} else if(id=='mute'){
if(isButtonPushed('mute')){
pushUnpushButtons('',['mute']);
} else {
pushUnpushButtons('mute',[]);
}
video.muted=!video.muted;
}

}
/* setEffect处理程序,图形处理 */
function setEffect(e) {
var id=e.target.getAttribute('id');

if(id=='normal'){
pushUnpushButtons('normal',['western','noir','scifi']);
effectFunction=null;

} else if(id=='western'){
pushUnpushButtons('western',['normal','noir','scifi']);
effectFunction=western;

} else if(id=='noir'){
pushUnpushButtons('noir',['normal','western','scifi']);
effectFunction=noir;

} else if(id=='scifi'){
pushUnpushButtons('scifi',['normal','western','noir']);
effectFunction=scifi;
}

}
/* setVideo处理程序,图形处理 */
function setVideo(e){
var id=e.target.getAttribute('id');
var video=document.getElementById('video');
if(id=='video1'){
pushUnpushButtons('video1',['video2']);
} else if (id=='video2'){
pushUnpushButtons('video2',['video1']);
}

video.src=videos[id]+getFormatExtension();
video.load();
pushUnpushButtons('pause',['play']);

}

function pushUnpushButtons(idToPush,idArrayToUnpush){
/* 按下的按钮处理程序，图形上的处理 */
if(idToPush!=''){
var anchor=document.getElementById(idToPush);
var theClass=anchor.getAttribute('class');
if(!theClass.indexOf('selected')>=0){
theClass=theClass+'selected';
anchor.setAttribute('class',theClass);
var newImage='url(video-page/image/'+idToPush+'pressed.png)'; //这里犯了一个错误，右括号')'未加.
anchor.style.backgroundImage=newImage;
}
}
/* 未按下的按钮处理程序，图形上的处理 */
for(var i=0;i<idArrayToUnpush.length;i++){
anchor=document.getElementById(idArrayToUnpush[i]);
theClass=anchor.getAttribute('class');
if(theClass.indexOf('selected')>=0){
theClass=theClass.replace('selected','');
anchor.setAttribute('class',theClass);
anchor.style.backgroundImage='';
}

}

}

/* isButtonPushed处理程序 */
function isButtonPushed(id) {
var anchor=document.getElementById(id);
var theClass=anchor.getAttribute('class');
return (theClass.indexOf('selected')>=0);
}// 在字符串信息上添加'selected'字符串，标记是否按下，按下则给元素的'class'属性加上'selected'字符串，未按则不做任何变化。
//使用字符串的indexOf检索方法来判断是否按下了按钮。

function getFormatExtension() {
var video=document.getElementById('video');
if(video.canPlayType('video/mp4')!=''){ //.ogg视频容器，'.ogv'视频后缀
return '.mp4';
}
if(video.canPlayType('video/ogg')!=''){
return '.ogv'
}
if(video.canPlayType('video/webm')!=''){
return '.webm'
}
}

function noir(pos,r,g,b,data){
var brightness=(5*r+9*g+2*b)>>>4;
if(brightness<0) brightness=0;
data[pos*4+0]=brightness;
data[pos*4+1]=brightness;
data[pos*4+2]=brightness;
}
function western(pos,r,g,b,outputData){
var offset=pos*4;
if(outputData[offset]<120){
outputData[offset]=80;
outputData[++offset]=80;
outputData[++offset]=80;
} else {
outputData[offset]=255;
outputData[++offset]=255;
outputData[++offset]=255;
}
outputData[++offset]=255;
++offset;
}

function scifi(pos,r,g,b,data) {
var offset=pos*4;
data[offset]=Math.round(255-r);
data[offset+1]=Math.round(255-g);
data[offset+2]=Math.round(255-b);
}