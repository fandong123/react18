import { HostRoot } from "./ReactWorkTags";

const concurrentQueue = [];
let concurrentQueuesIndex = 0;

function enqueueUpdate(fiber, queue, update) {
  concurrentQueue[concurrentQueuesIndex++] = fiber;
  concurrentQueue[concurrentQueuesIndex++] = queue;
  concurrentQueue[concurrentQueuesIndex++] = update;
}

export function enqueueConcurrentHookUpdate(fiber, queue, update) {
  enqueueUpdate(fiber, queue, update);
  return getRootForUpdateFiber(fiber);
}

function getRootForUpdateFiber(sourceFiber) {
  let node = sourceFiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  return node.tag === HostRoot ? node.stateNode: null;
}


export function finishQueueingConcurrentUpdates() {
  const endIndex = concurrentQueuesIndex;
  concurrentQueuesIndex = 0;
  let i = 0;
  while (i < endIndex) {
    const fiber = concurrentQueue[i++];
    const queue = concurrentQueue[i++];
    const update = concurrentQueue[i++];
    if (queue !== null && update !== null) {
      const pending = queue.pending;
      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
      queue.pending = update;
    }
  }
}

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