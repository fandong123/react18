import { HostRoot } from "./ReactWorkTags";

/**
 * 从源 Fiber 向上遍历树，找到根节点。
 * @param {Fiber} sourceFiber - 源 Fiber。
 * @returns {Node|null} - 如果找到根节点，则返回根节点；否则返回 null。
 */
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }
  // 持续向上遍历树，知道找到根节点
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}