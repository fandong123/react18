import { allowConcurrentByDefault } from 'shared/ReactFeatureFlags';

/** 总车道数量 */
export const TotalLanes = 31;
/** 无车道 */
export const NoLanes = 0b0000000000000000000000000000000;
/** 无车道 */
export const NoLane = 0b0000000000000000000000000000000;
/** 同步车道 */
export const SyncLane = 0b0000000000000000000000000000001;
/** 输入连续水合车道 */
export const InputContinuousHydrationLane = 0b0000000000000000000000000000010;
/** 输入连续车道 */
export const InputContinuousLane = 0b0000000000000000000000000000100;
/** 默认水合车道 */
export const DefaultHydrationLane = 0b0000000000000000000000000001000;
/** 默认车道 */
export const DefaultLane = 0b0000000000000000000000000010000;
/** 选择性水合车道 */
export const SelectiveHydrationLane = 0b0001000000000000000000000000000;
/** 空闲水合车道 */
export const IdleHydrationLane = 0b0010000000000000000000000000000;
/** 空闲车道 */
export const IdleLane = 0b0100000000000000000000000000000;
/** 屏幕外车道 */
export const OffscreenLane = 0b1000000000000000000000000000000;
/** 非空闲车道 */
const NonIdleLanes = 0b0001111111111111111111111111111;

/**
 * 标记根节点更新
 * @param {object} root - 根节点
 * @param {number} updateLane - 更新的车道
 */
export function markRootUpdated(root, updateLane) {
  root.pendingLanes |= updateLane;
}

/**
 * 获取下一个车道
 * @param {object} root - 根节点
 * @returns {number} 下一个车道
 */
export function getNextLanes(root) {
  const pendingLanes = root.pendingLanes;
  if (pendingLanes == NoLanes) {
    return NoLanes;
  }
  const nextLanes = getHighestPriorityLanes(pendingLanes);
  return nextLanes;
}

/**
 * 获取最高优先级的车道
 * @param {number} lanes - 车道
 * @returns {number} 最高优先级的车道
 */
export function getHighestPriorityLanes(lanes) {
  return getHighestPriorityLane(lanes);
}

/**
 * 获取最高优先级的车道
 * @param {number} lanes - 车道
 * @returns {number} 最高优先级的车道
 */
export function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}

/**
 * 包括非空闲工作
 * @param {number} lanes - 车道
 * @returns {boolean} 如果包括非空闲工作则返回真
 */
export function includesNonIdleWork(lanes) {
  return (lanes & NonIdleLanes) !== NoLanes;
}

/**
 * 是否为车道的子集
 * @param {number} set - 集合
 * @param {number} subset - 子集
 * @returns {boolean} 如果是子集则返回真
 */
export function isSubsetOfLanes(set, subset) {
  return (set & subset) === subset;
}

/**
 * 合并车道
 * @param {number} a - 车道a
 * @param {number} b - 车道b
 * @returns {number} 合并后的车道
 */
export function mergeLanes(a, b) {
  return a | b;
}

/**
 * 包括阻塞车道
 * @param {object} root - 根节点
 * @param {number} lanes - 车道
 * @returns {boolean} 如果包括阻塞车道则返回假
 */
export function includesBlockingLane(root, lanes) {
  if (allowConcurrentByDefault) {
    return false;
  }
  const SyncDefaultLanes = InputContinuousLane | DefaultLane;
  return (lanes & SyncDefaultLanes) !== NoLane;
}