import { scheduleCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";
import { NoFlags, MutationMask } from "./ReactFiberFlags";
import { commitMutationEffectsOnFiber } from './ReactFiberCommitWork';

let workInProgress;
/**
 * 在 Fiber 上计划更新根节点。
 * @param {*} root - 根节点。
 */
export function scheduleUpdateOnFiber(root) {
  ensureRootIsScheduled(root);
}

/**
 * 确保根节点被调度执行。
 * @param {*} root - 根节点。
 */
function ensureRootIsScheduled(root) {
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 执行根节点上的并发工作。
 * @param {*} root - 根节点。
 */
function performConcurrentWorkOnRoot(root) {
  renderRootSync(root);
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
}

/**
 * 提交根节点。
 * @param {*} root - 根节点。
 */
function commitRoot(root) {
  const { finishedWork } = root;
  const subtreeHasEffects = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
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
  }
  
  root.current = finishedWork;
}

/**
 * 同步渲染根节点。
 * @param {*} root - 根节点。
 */
function renderRootSync(root) {
  prepareFreshStack(root);
  workLoopSync();
}

/**
 * 准备一个新的工作栈。
 * @param {*} root - 根节点。
 */
function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
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
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  // workInProgress = null //临时加上，防止死循环

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
  console.log("开启comleteWork阶段");
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
}
