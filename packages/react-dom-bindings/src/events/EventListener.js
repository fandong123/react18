/**
 * 在目标元素上添加捕获阶段的事件监听器
 * 
 * @param {EventTarget} target - 目标元素，我们想要在上面添加监听器的元素
 * @param {string} eventType - 事件类型，我们想要监听的事件的名称
 * @param {Function} listener - 监听器函数，当事件发生时将调用的函数
 * 
 * @returns {Function} 返回添加的监听器函数
 */
export function addEventCaptureListener(target, eventType, listener) {
  // 调用目标元素的 addEventListener 方法，添加捕获阶段的事件监听器
  target.addEventListener(eventType, listener, true);
  
  // 返回添加的监听器函数
  return listener;
}

/**
 * 在目标元素上添加冒泡阶段的事件监听器
 * 
 * @param {EventTarget} target - 目标元素，我们想要在上面添加监听器的元素
 * @param {string} eventType - 事件类型，我们想要监听的事件的名称
 * @param {Function} listener - 监听器函数，当事件发生时将调用的函数
 * 
 * @returns {Function} 返回添加的监听器函数
 */
export function addEventBubbleListener(target, eventType, listener) {
  // 调用目标元素的 addEventListener 方法，添加冒泡阶段的事件监听器
  target.addEventListener(eventType, listener, false);
  
  // 返回添加的监听器函数
  return listener;
}