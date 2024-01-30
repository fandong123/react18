
/**
 * 创建一个 Set 来存储所有的原生事件
 */
export const allNativeEvents = new Set();

/**
 * 注册一个两阶段的事件（包括捕获和冒泡阶段）
 * 
 * @param {string} registrationName - 注册的事件名称
 * @param {Array<string>} dependencies - 事件依赖的其他事件的名称的数组
 */
export function registerTwoPhaseEvent(registrationName, dependencies) {
  // 直接注册事件（可能是冒泡阶段的）
  registerDirectEvent(registrationName, dependencies);
  
  // 注册捕获阶段的事件
  // 通过在事件名称后添加 'Capture' 后缀来区分
  registerDirectEvent(registrationName + 'Capture', dependencies);
}

/**
 * 直接注册事件（包括冒泡或捕获阶段）
 * 
 * @param {string} registrationName - 注册的事件名称
 * @param {Array<string>} dependencies - 事件依赖的其他事件的名称的数组
 */
export function registerDirectEvent(registrationName, dependencies) {
  // 遍历依赖事件数组
  for (let i = 0; i < dependencies.length; i++) {
    // 将每个依赖事件添加到 allNativeEvents Set 中
    allNativeEvents.add(dependencies[i]);
  }
}