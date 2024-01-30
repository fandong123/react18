/**
 * 设置节点的样式
 *
 * @param {HTMLElement} node - 目标节点
 * @param {Object} styles - 包含样式属性和值的对象
 *
 * setValueForStyles函数用于遍历传入的styles对象，并将其属性值应用到目标节点的style属性中。
 * 该函数首先获取节点的style属性，然后遍历styles对象。如果styles对象有对应的样式属性，则获取对应的样式值，
 * 并将该样式值应用到节点的style属性中。
 */
export function setValueForStyles(node, styles) {
  const { style } = node;

  for (const styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      const styleValue = styles[styleName];
      style[styleName] = styleValue;
    }
  }
}
