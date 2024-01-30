import { createHostRootFiber } from './ReactFiber';
import { initialUpdateQueue } from './ReactFiberClassUpdateQueue';

/**
 * Fiber 根节点对象构造函数。
 * @param {any} containerInfo - 容器信息。
 */
function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo; // 容器信息，如 div#root
}

/**
 * 创建 Fiber 根节点。
 * @param {any} containerInfo - 容器信息。
 * @returns {FiberRootNode} - 创建的 Fiber 根节点。
 */
export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  // 创建未初始化的根 Fiber
  const uninitializedFiber = createHostRootFiber();
  // 根容器的 current 指向当前的根 Fiber
  root.current = uninitializedFiber;
  // 根 Fiber 的 stateNode，即真实 DOM 节点，指向 FiberRootNode
  uninitializedFiber.stateNode = root;
  // 初始化根 Fiber 的更新队列
  initialUpdateQueue(uninitializedFiber);
  return root;
}
