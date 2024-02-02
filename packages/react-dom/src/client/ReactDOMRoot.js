import {
  createContainer,
  updateContainer
} from 'react-reconciler/src/ReactFiberReconciler';
import { listenToAllSupportedEvents } from 'react-dom-bindings/src/events/DOMPluginEventSystem';

/**
 * ReactDOMRoot构造函数
 *
 * @param {Object} internalRoot - React Fiber树的根节点
 *
 * 这个构造函数用于创建ReactDOMRoot实例对象，实例对象中包含了一个_internalRoot属性，该属性引用了React Fiber树的根节点。
 */
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

/**
 * render方法，负责更新或渲染React组件树
 *
 * @param {ReactElement|ReactComponent} children - 需要渲染的React元素或组件
 *
 * render方法是挂载在ReactDOMRoot原型链上的，每个ReactDOMRoot实例对象都可以调用这个方法。
 * 当调用render方法时，会通过调用updateContainer函数，将传入的React元素或组件(children参数)更新或渲染到当前的Fiber树(_internalRoot属性对应的Fiber树)中。
 */
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root);
}

/**
 * 创建Fiber根节点并封装为ReactDOMRoot对象的工厂函数
 *
 * @param {HTMLElement} container - React组件需要渲染到的DOM元素
 * @returns {ReactDOMRoot} 封装了Fiber根节点的ReactDOMRoot对象
 *
 * createRoot是一个工厂函数，接收一个DOM元素作为参数，这个DOM元素通常是React应用的根DOM节点。
 * 在函数内部，首先通过调用createContainer函数，传入DOM元素参数，创建一个Fiber根节点。
 * 然后将这个Fiber根节点传入ReactDOMRoot构造函数，创建一个ReactDOMRoot实例对象，并返回。
 */
export function createRoot(container) {
  const root = createContainer(container);
  listenToAllSupportedEvents(container);
  return new ReactDOMRoot(root);
}