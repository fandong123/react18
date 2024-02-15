import { enqueueConcurrentClassUpdate } from "./ReactFiberConcurrentUpdates";
import assign from 'shared/assign';
import { NoLanes, mergeLanes, isSubsetOfLanes } from './ReactFiberLane';

export const UpdateState = 0;

/**
 * 初始化fiber节点的更新队列
 * @param {FiberNode} fiber - 需要初始化更新队列的fiber节点
 */
export function initialUpdateQueue(fiber) {
  const queue = {
    shared: {
      baseState: fiber.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      pending: null, // 创建一个新的更新队列，其中pending是一个循环链表
    },
  };
  fiber.updateQueue = queue;
}

/**
 * 创建更新对象
 * @param {number} lane - 车道信息
 * @returns {Object} update - 返回一个新的更新对象
 */
export function createUpdate(lane) {
  const update = { tag: UpdateState, lane, next: null };
  return update;
}

/**
 * 将更新对象添加到fiber节点的更新队列中
 * @param {FiberNode} fiber - 需要添加更新的fiber节点
 * @param {Update} update - 待添加的更新对象
 * @returns {FiberNode} fiber根节点
 */
export function enqueueUpdate(fiber, update, lane) {
  const updateQueue = fiber.updateQueue;
  const sharedQueue = updateQueue.shared;
  return enqueueConcurrentClassUpdate(fiber, sharedQueue, update, lane);
}

/**
 * 将更新加入队列
 * @param {Object} fiber - fiber对象
 * @param {Object} update - 更新对象
 * @param {number} lane - 车道信息
 * @returns {Object} 更新后的fiber对象
 */
export function processUpdateQueue(workInProgress, nextProps, renderLanes) {
  const queue = workInProgress.updateQueue;
  let firstBaseUpdate = queue.shared.firstBaseUpdate;
  let lastBaseUpdate = queue.shared.lastBaseUpdate;
  const pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    queue.shared.pending = null;
    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;
    lastPendingUpdate.next = null;
    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }
    lastBaseUpdate = lastPendingUpdate;
  }
  if (firstBaseUpdate !== null) {
    let newState = queue.baseState;
    let newLanes = NoLanes;
    let newBaseState = null;
    let newFirstBaseUpdate = null;
    let newLastBaseUpdate = null;
    let update = firstBaseUpdate;
    do {
      const updateLane = update.lane;
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        const clone = {
          id: update.id,
          lane: updateLane,
          payload: update.payload
        };
        if (newLastBaseUpdate === null) {
          newFirstBaseUpdate = newLastBaseUpdate = clone;
          newBaseState = newState;
        } else {
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }
        newLanes = mergeLanes(newLanes, updateLane);
      } else {
        if (newLastBaseUpdate !== null) {
          const clone = {
            id: update.id,
            lane: 0,
            payload: update.payload
          };
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }
        newState = getStateFromUpdate(update, newState);
      }
      update = update.next;
    } while (update);
    if (!newLastBaseUpdate) {
      newBaseState = newState;
    }
    queue.baseState = newBaseState;
    queue.firstBaseUpdate = newFirstBaseUpdate;
    queue.lastBaseUpdate = newLastBaseUpdate;
    workInProgress.lanes = newLanes;
    workInProgress.memoizedState = newState;
  }
}

/**
 * 根据更新计算新状态
 * @private
 * @param {Object} update - 更新对象
 * @param {*} prevState - 上一个状态
 * @param {*} nextProps - 下一个属性集合
 * @returns {*} 新的状态
 */
function getStateFromUpdate(update, prevState, nextProps) {
  switch (update.tag) {
    case UpdateState:
      const { payload } = update;
      let partialState;
      if (typeof payload === 'function') {
        partialState = payload.call(null, prevState, nextProps);
      } else {
        partialState = payload;
      }
      return assign({}, prevState, partialState);
  }
}

/**
 * 克隆更新队列
 * @param {Object} current - 当前状态下的fiber对象
 * @param {Object} workInProgress - 正在工作的fiber对象
 */
export function cloneUpdateQueue(current, workInProgress) {
  const workInProgressQueue = workInProgress.updateQueue;
  const currentQueue = current.updateQueue;
  if (currentQueue === workInProgressQueue) {
    const clone = {
      baseState: currentQueue.baseState,
      firstBaseUpdate: currentQueue.firstBaseUpdate,
      lastBaseUpdate: currentQueue.lastBaseUpdate,
      shared: currentQueue.shared
    };
    workInProgress.updateQueue = clone;
  }
}