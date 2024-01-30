import { getFiberCurrentPropsFromNode } from "../client/ReactDOMComponentTree";

/**
 * 从给定的React实例中获取指定事件的监听函数。
 *
 * @param {Object} instance - React实例。
 * @param {string} registrationName - 注册的事件名（例如，'onClick'）。
 * @returns {Function|null} - 返回该事件的监听函数，如果不存在则返回null。
 */
export default function getListener(instance, registrationName) {
  // 从实例中取出状态节点
  const { stateNode } = instance;
  // 如果状态节点不存在，返回null
  if (stateNode === null)
    return null;
  // 使用ReactDOMComponentTree模块的getFiberCurrentPropsFromNode函数，获取状态节点当前的props
  const props = getFiberCurrentPropsFromNode(stateNode);
  // 如果props不存在，返回null
  if (props === null)
    return null;
  // 从props中获取对应事件名的监听函数
  const listener = props[registrationName];
  // 返回监听函数，如果不存在，此处将返回undefined
  return listener;
}