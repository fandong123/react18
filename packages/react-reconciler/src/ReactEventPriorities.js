import {
  NoLane,
  SyncLane,
  InputContinuousLane,
  DefaultLane,
  IdleLane,
  getHighestPriorityLane,
  includesNonIdleWork,
} from "./ReactFiberLane";

/** 离散事件优先级，与SyncLane相关联 eg: 鼠标点击 */
export const DiscreteEventPriority = SyncLane;
/** 连续事件优先级，与InputContinuousLane相关联 eg: 鼠标移动 */
export const ContinuousEventPriority = InputContinuousLane;
/** 默认事件优先级，与DefaultLane相关联 */
export const DefaultEventPriority = DefaultLane;
/** 空闲事件优先级，与IdleLane相关联 */
export const IdleEventPriority = IdleLane;

/** 当前更新优先级值 */
let currentUpdatePriority = NoLane;

/**
 * 获取当前更新优先级。
 * @returns {number} 当前更新优先级。
 */
export function getCurrentUpdatePriority() {
  return currentUpdatePriority;
}

/**
 * 设置当前更新优先级。
 * @param {number} newPriority - 要设置的新优先级。
 */
export function setCurrentUpdatePriority(newPriority) {
  currentUpdatePriority = newPriority;
}

/**
 * 判断事件优先级是否高于（数值更小）车道。
 * @param {number} eventPriority - 要比较的事件优先级。
 * @param {number} lane - 要与之比较的车道值。
 * @returns {boolean} 如果事件优先级更高则返回真；否则返回假。
 */
export function isHigherEventPriority(eventPriority, lane) {
  return (eventPriority !== 0) && eventPriority < lane;
}

/**
 * 将车道转换为事件优先级。
 * @param {number} lanes - 车道值。
 * @returns {number} 与车道相对应的事件优先级。
 */
export function lanesToEventPriority(lanes) {
  let lane = getHighestPriorityLane(lanes);
  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority;
  }
  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority;
  }
  if (includesNonIdleWork(lane)) {
    return DefaultEventPriority;
  }
  return IdleEventPriority;
}