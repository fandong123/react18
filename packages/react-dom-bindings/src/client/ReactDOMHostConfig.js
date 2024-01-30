// 引入初始属性设置函数
import { setInitialProperties } from "./ReactDOMComponent";

/**
 * 判断是否需要设置文本内容
 *
 * @param {string} type - DOM元素的类型
 * @param {Object} props - 元素属性对象
 * @return {boolean} - 如果children属性是字符串或数字，返回true，否则返回false
 *
 * shouldSetTextContent函数用于判断基于给定的属性，是否应该设置DOM元素的文本内容。
 */
export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

/**
 * 创建文本节点实例
 *
 * @param {string} content - 文本内容
 * @return {Text} - 创建的文本节点
 *
 * createTextInstance函数用于创建一个新的文本节点，其中的内容是传入的content参数。
 */
export function createTextInstance(content) {
  return document.createTextNode(content);
}

/**
 * 创建DOM元素实例
 *
 * @param {string} type - DOM元素的类型
 * @return {HTMLElement} - 创建的DOM元素
 *
 * createInstance函数用于创建一个新的DOM元素，元素类型由传入的type参数指定。
 */
export function createInstance(type) {
  const domElement = document.createElement(type);
  return domElement;
}

/**
 * 将初始子节点附加到父节点
 *
 * @param {HTMLElement} parent - 父节点
 * @param {HTMLElement|Text} child - 子节点
 *
 * appendInitialChild函数用于将子节点附加到指定的父节点。
 */
export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

/**
 * 为DOM元素设置初始属性
 *
 * @param {HTMLElement} domElement - 目标DOM元素
 * @param {string} type - DOM元素的类型
 * @param {Object} props - 需要设置的属性对象
 *
 * finalizeInitialChildren函数用于在DOM元素创建完成后，设置其初始属性。
 */
export function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}

/**
 * 将子节点附加到父节点
 *
 * @param {HTMLElement} parentInstance - 父节点
 * @param {HTMLElement|Text} child - 子节点
 *
 * appendChild函数用于将子节点附加到指定的父节点。
 */
export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}

/**
 * 在指定子节点前插入新的子节点
 *
 * @param {HTMLElement} parentInstance - 父节点
 * @param {HTMLElement|Text} child - 需要插入的新子节点
 * @param {HTMLElement|Text} beforeChild - 指定的子节点
 *
 * insertBefore函数用于在父节点的指定子节点前插入一个新的子节点。
 */
export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}
