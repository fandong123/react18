/**
 * 设置节点的属性
 *
 * @param {HTMLElement} node - 目标节点
 * @param {string} name - 属性名
 * @param {*} value - 属性值
 *
 * setValueForProperty函数用于设置目标节点的属性。如果传入的属性值为null，
 * 则会移除节点的对应属性，否则，会将属性值设置到节点的对应属性上。
 */
export function setValueForProperty(node, name, value) {
  if (value === null) {
    node.removeAttribute(name);
  } else {
    node.setAttribute(name, value);
  }
}