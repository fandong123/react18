// import { scheduleCallback, NormalPriority as NormalSchedulerPriority, } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";
import { NoFlags, MutationMask, Passive } from "./ReactFiberFlags";
import { finishQueueingConcurrentUpdates } from "./ReactFiberConcurrentUpdates";
import {
  commitMutationEffectsOnFiber,
  commitPassiveUnmountEffects,
  commitPassiveMountEffects,
  commitLayoutEffects,
} from "./ReactFiberCommitWork";
import {
  NoLanes,
  markRootUpdated,
  getNextLanes,
  getHighestPriorityLane,
  SyncLane,
  includesBlockingLane,
} from "./ReactFiberLane";
import {
  scheduleCallback as Scheduler_scheduleCallback,
  shouldYield,
  ImmediatePriority as ImmediateSchedulerPriority,
  UserBlockingPriority as UserBlockingSchedulerPriority,
  NormalPriority as NormalSchedulerPriority,
  IdlePriority as IdleSchedulerPriority,
} from "./Scheduler";
import {
  getCurrentUpdatePriority,
  lanesToEventPriority,
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
  IdleEventPriority,
} from "./ReactEventPriorities";
import { getCurrentEventPriority } from "react-dom-bindings/src/client/ReactDOMHostConfig";
import {
  scheduleSyncCallback,
  flushSyncCallbacks,
} from "./ReactFiberSyncTaskQueue";

const RootInProgress = 0;
const RootCompleted = 5;
let workInProgressRootExitStatus = RootInProgress;
let rootDoesHavePassiveEffect = false;
let rootWithPendingPassiveEffects = null;

let workInProgress;

let workInProgressRoot = null;
let workInProgressRenderLanes = NoLanes;

function flushPassiveEffect() {
  if (rootWithPendingPassiveEffects !== null) {
    const root = rootWithPendingPassiveEffects;
    commitPassiveUnmountEffects(root.current);
    commitPassiveMountEffects(root, root.current);
  }
}

/**
 * 在 Fiber 上计划更新根节点。
 * @param {*} root - 根节点。
 */
export function scheduleUpdateOnFiber(root, fiber, lane) {
  markRootUpdated(root, lane);
  ensureRootIsScheduled(root);
}

/**
 * 确保根节点被调度执行。
 * @param {*} root - 根节点。
 */
function ensureRootIsScheduled(root) {
  const nextLanes = getNextLanes(root, NoLanes);
  if (nextLanes === NoLanes) {
    return;
  }
  let newCallbackPriority = getHighestPriorityLane(nextLanes);
  let newCallbackNode;
  if (newCallbackPriority === SyncLane) {
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    queueMicrotask(flushSyncCallbacks);
    newCallbackNode = null;
  } else {
    let schedulerPriorityLevel;
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority;
        break;
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority;
        break;
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority;
        break;
      default:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
    }
    newCallbackNode = Scheduler_scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root)
    );
  }
  root.callbackNode = newCallbackNode;
}

function performSyncWorkOnRoot(root) {
  const lanes = getNextLanes(root);
  renderRootSync(root, lanes);
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
  return null;
}

/**
 * 执行根节点上的并发工作。
 * @param {*} root - 根节点。
 */
function performConcurrentWorkOnRoot(root, didTimeout) {
  const originalCallbackNode = root.callbackNode;
  const lanes = getNextLanes(root, NoLanes);
  if (lanes === NoLanes) {
    return null;
  }
  const shouldTimeSlice = !includesBlockingLane(root, lanes) && !didTimeout;
  const exitStatus = shouldTimeSlice
    ? renderRootConcurrent(root, lanes)
    : renderRootSync(root, lanes);
  if (exitStatus !== RootInProgress) {
    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
    commitRoot(root);
  }
  if (root.callbackNode === originalCallbackNode) {
    return performConcurrentWorkOnRoot.bind(null, root);
  }
  return null;
}

function renderRootConcurrent(root, lanes) {
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    prepareFreshStack(root, lanes);
  }
  workLoopConcurrent();
  if (workInProgress !== null) {
    return RootInProgress;
  }
  return workInProgressRootExitStatus;
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}

/**
 * 提交根节点。
 * @param {*} root - 根节点。
 */
function commitRoot(root) {
  const { finishedWork } = root;
  workInProgressRoot = null;
  workInProgressRenderLanes = null;
  root.callbackNode = null;
  if (
    (finishedWork.subtreeFlags & Passive) !== NoFlags ||
    (finishedWork.flags & Passive) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = true;
      Scheduler_scheduleCallback(NormalSchedulerPriority, flushPassiveEffect);
    }
  }
  const subtreeHasEffects =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  /**
   * eg: 0b0010 & 0b1100  &符号找出相同的位数，没有则为0，与 |符号相反
   *   0b0010
   * & 0b1100
   * ___________
   *   0b0000
   * */
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

  if (subtreeHasEffects || rootHasEffect) {
    commitMutationEffectsOnFiber(finishedWork, root);
    commitLayoutEffects(finishedWork, root);
    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false;
      rootWithPendingPassiveEffects = root;
    }
  }

  root.current = finishedWork;
}

/**
 * 同步渲染根节点。
 * @param {*} root - 根节点。
 */
function renderRootSync(root, renderLanes) {
  if (
    root !== workInProgressRoot ||
    workInProgressRootRenderLanes !== renderLanes
  ) {
    prepareFreshStack(root, renderLanes);
  }
  workLoopSync();
}

/**
 * 准备一个新的工作栈。
 * @param {*} root - 根节点。
 */
function prepareFreshStack(root, renderLanes) {
  if (
    root !== workInProgressRoot ||
    workInProgressRenderLanes !== renderLanes
  ) {
    workInProgress = createWorkInProgress(root.current, null);
  }
  workInProgressRenderLanes = renderLanes;
  finishQueueingConcurrentUpdates();
}

/**
 * 同步工作循环。
 */
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行一个工作单元。
 * @param {*} unitOfWork - 工作单元。
 */
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  const next = beginWork(current, unitOfWork, workInProgressRenderLanes);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

/**
 * 完成一个工作单元。
 * @param {*} unitOfWork - 工作单元。
 */
function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;

  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    completeWork(current, completedWork);

    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }

    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted;
  }
}

export function requestUpdateLane() {
  const updateLane = getCurrentUpdatePriority();
  if (updateLane !== NoLanes) {
    return updateLane;
  }
  const eventLane = getCurrentEventPriority();
  return eventLane;
}
