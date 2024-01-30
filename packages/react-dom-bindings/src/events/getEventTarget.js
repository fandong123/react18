/**
 * 获取原生事件的目标元素。如果原生事件没有目标元素，
 * 则尝试获取事件的 `srcElement`，如果仍然没有，则返回全局 `window` 对象。
 *
 * @param {Event} nativeEvent - 原生的 DOM 事件对象
 * @returns {EventTarget|Window} - 事件的目标元素或 `window` 对象
 */
function getEventTarget(nativeEvent) {
  const target = nativeEvent.target || nativeEvent.srcElement || window;
  return target;
}

export default getEventTarget;