// 引入CSS样式设置函数
import { setValueForStyles } from './CSSPropertyOperations';
// 引入文本设置函数
import setTextContent from './setTextContent';
// 引入DOM属性设置函数
import { setValueForProperty } from './DOMPropertyOperations';

/**
 * 设置初始DOM属性
 * 
 * @param {string} tag - DOM元素的标签名
 * @param {HTMLElement} domElement - 目标DOM元素
 * @param {Object} nextProps - 需要设置的属性对象
 *
 * setInitialDOMProperties函数用于设置目标DOM元素的初始属性。它遍历nextProps对象中的所有属性，
 * 对于'style'属性，使用setValueForStyles函数设置DOM元素的样式；
 * 对于'children'属性，根据属性值的类型（字符串或数字），使用setTextContent函数设置DOM元素的文本内容；
 * 对于其他非空属性，使用setValueForProperty函数设置DOM元素的对应属性。
 */
function setInitialDOMProperties(tag, domElement, nextProps) {
  for (const propKey in nextProps) {
    if (nextProps.hasOwnProperty(propKey)) {
      const nextProp = nextProps[propKey];
      if (propKey === 'style') {
        setValueForStyles(domElement, nextProp);
      } else if (propKey == 'children') {
        if (typeof nextProp === 'string') {
          setTextContent(domElement, nextProp);
        } else if (typeof nextProp === 'number') {
          setTextContent(domElement, `${nextProp}`);
        }
      } else if (nextProp !== null) {
        setValueForProperty(domElement, propKey, nextProp)
      }
    }
  }
}

/**
 * 设置初始属性
 *
 * @param {HTMLElement} domElement - 目标DOM元素
 * @param {string} tag - DOM元素的标签名
 * @param {Object} props - 需要设置的属性对象
 *
 * setInitialProperties函数是setInitialDOMProperties函数的外部接口，它直接调用setInitialDOMProperties函数，
 * 将传入的参数domElement, tag, props作为参数传递给setInitialDOMProperties函数。
 */
export function setInitialProperties(domElement, tag, props) {
  setInitialDOMProperties(tag, domElement, props);
}

export function diffProperties(domElement, tag, lastProps, nextProps) {
  let updatePayload = null;
  let propKey;
  let styleName;
  let styleUpdates = null;
  for (propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] === null) {
      continue;
    }
    if (propKey === 'style') {
      const lastStyle = lastProps[propKey];
      for (styleName in lastStyle) {
        if (lastStyle.hasOwnProperty(styleName)) {
          if (!styleUpdates) {
            styleUpdates = {};
          }
          styleUpdates[styleName] = '';
        }
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  for (propKey in nextProps) {
    const nextProp = nextProps[propKey];
    const lastProp = lastProps !== null ? lastProps[propKey] : undefined;
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp === null && lastProp === null)) {
      continue;
    }
    if (propKey === 'style') {
      if (lastProp) {
        for (styleName in lastProp) {
          if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
            if (!styleUpdates)
              styleUpdates = {};
            styleUpdates[styleName] = '';
          }
        }
        for (styleName in nextProp) {
          if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
            if (!styleUpdates)
              styleUpdates = {};
            styleUpdates[styleName] = nextProp[styleName];
          }
        }
      } else {
        styleUpdates = nextProp;
      }
    } else if (propKey === 'children') {
      if (typeof nextProp === 'string' || typeof nextProp === 'number') {
        (updatePayload = updatePayload || []).push(propKey, nextProp);
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }
  if (styleUpdates) {
    (updatePayload = updatePayload || []).push('style', styleUpdates);
  }
  return updatePayload;
}

export function updateProperties(domElement, updatePayload) {
  updateDOMProperties(domElement, updatePayload);
}

function updateDOMProperties(domElement, updatePayload) {
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];
    if (propKey === 'style') {
      setValueForStyles(domElement, propValue);
    } else if (propKey === 'children') {
      setTextContent(domElement, propValue);
    } else {
      setValueForProperty(domElement, propKey, propValue);
    }
  }
}