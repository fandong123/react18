import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdates';
import assign from 'shared/assign';
/**
 * 初始化fiber节点的更新队列
 * @param {FiberNode} fiber - 需要初始化更新队列的fiber节点
 */
export function initialUpdateQueue(fiber) {
  const queue = {
    shared: {
      pending: null, // 创建一个新的更新队列，其中pending是一个循环链表
    },
  };
  fiber.updateQueue = queue;
}

/**
 * 创建一个状态更新对象
 * @returns {Update} 更新对象
 */
export function createUpdate() {
  const update = {};
  return update;
}

/**
 * 将更新对象添加到fiber节点的更新队列中
 * @param {FiberNode} fiber - 需要添加更新的fiber节点
 * @param {Update} update - 待添加的更新对象
 * @returns {FiberNode} fiber根节点
 */
export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const pending = updateQueue.shared.pending;
  // 如果pending为空，则让update自引用形成一个循环链表
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  // pending始终指向最后一个更新对象，形成一个单向循环链表
  updateQueue.shared.pending = update;
  return markUpdateLaneFromFiberToRoot(fiber);
}

/**
 * 根据老状态和更新队列中的更新计算最新的状态
 * @param {FiberNode} workInProgress - 需要计算新状态的fiber节点
 */
export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue;
  const pendingQueue = queue.shared.pending;

  // 如果有更新，则清空更新队列并开始计算新的状态
  if (pendingQueue !== null) {
    queue.shared.pending = null;
    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;

    // 把更新链表剪开，变成一个单链表
    lastPendingUpdate.next = null;
    let newState = workInProgress.memoizedState;
    let update = firstPendingUpdate;

    // 遍历更新队列，根据老状态和更新对象计算新状态
    while (update) {
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }

    // 更新fiber节点的memoizedState
    workInProgress.memoizedState = newState;
  }
}

/**
 * 根据老状态和更新对象计算新状态
 * @param {Update} update - 更新对象
 * @param {*} prevState - 老状态
 * @returns {*} 新状态
 */
function getStateFromUpdate(update, prevState) {
  // switch (update.tag) {
    // case UpdateState:
      const { payload } = update;
      // 合并prevState和payload为新状态
      return assign({}, prevState, payload);
  // }
}