import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber, requestUpdateLane  } from "./ReactFiberWorkLoop";

/**
 * 创建容器，用于将虚拟DOM转换为真实DOM并插入到容器中。
 * @param {*} containerInfo - DOM容器信息。
 * @returns {FiberRoot} - 创建的Fiber根节点。
 */
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容器，将虚拟DOM转换为真实DOM并插入到容器中。
 * @param {*} element - 虚拟DOM元素。
 * @param {*} container - DOM容器，FiberRootNode。
 */
export function updateContainer(element, container) {
  // 获取当前的根Fiber
  const current = container.current;
  const lane = requestUpdateLane(current);
  // 创建更新
  const update = createUpdate(lane);
  // 要更新的虚拟DOM
  update.payload = { element };
  // 将更新添加到当前根Fiber的更新队列上，并返回根节点
  const root = enqueueUpdate(current, update, lane);
  // 在根Fiber上调度更新
  scheduleUpdateOnFiber(root, current, lane);
}