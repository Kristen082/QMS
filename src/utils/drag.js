
// // function a(){
// //     console.log('function',document)
// // }
// // a()
// // console.log(document)


// function drag(window, document) {   
//   //工具函数的封装
//   var getByClassName = document.getElementsByClassName.bind(document);
//   var getStyle = function () {
//     return window.getComputedStyle ? function (element, style) {
//       return window.getComputedStyle(element)[style]
//     } : function (element, style) {
//       return element.currentStyle[style]
//     }
//   }();
  
//   var addEvent = function () {
//     return document.addEventListener ? function (element, eventType, callback) {
//       element.addEventListener(eventType, callback, false)
//     } : document.attachEvent ? function (element, eventType, callback) {
//       element.attachEvent("on" + eventType, callback)
//     } : function (element, eventType, callback) {
//       element["on" + eventType] = callback
//     }
//   }();

//   function setStyle(element, css) {
//     for (var k in css) {
//       if (css.hasOwnProperty(k)) {
//         element.style[k] = css[k]
//       }
//     }
//   }

//   var target = getByClassName("ant-modal-content")[0]; // 获取元素
//   console.log(target)
//   var x, y, mx, my, dx, dy, drag = false; // 需要设置一个drag来标记是否拖拽
//   addEvent(target, "mousedown", function (e) { // mousedown事件
//     e = e || window.event;
//     drag = true;
//     x = e.clientX;
//     y = e.clientY;
//     mx = this.offsetLeft;
//     my = this.offsetTop;
//     dx = x - mx;
//     dy = y - my;
//   });
//   addEvent(document, "mousemove", function (e) { // mousemove事件， 绑在document上比较好一点
//     e = e || window.event;
//     if (!drag) return false;  
//     var left = e.clientX - dx, // left = nx - (x - mx)
//       top = e.clientY - dy;  // top = ny - (y - my)
//     setStyle(target, {left: left + "px", top: top + "px"});
//   });
//   addEvent(target, "mouseup", function (e) { // mouseup鼠标松开
//     drag = false
//   });
// };
// drag(this, document)