// @flow

export type Size = {
  width: number,
  height: number,

  // relative to viewport
  topView: number,
  rightView: number,
  bottomView: number,
  leftView: number,

  // relative to page
  topAbs: number,
  rightAbs: number,
  bottomAbs: number,
  leftAbs: number,
}

export function getElementSize(element: HTMLElement): Size {
  if (!element || !element instanceof HTMLElement) throw new TypeError(`getElementSize expected dom element but received ${String(element)}`);

  const bounds = element.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  return {
    // bounds.width/height has worse browser support
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,

    topView: bounds.top,
    rightView: bounds.right,
    bottomView: bounds.bottom,
    leftView: bounds.left,

    topAbs: bounds.top + scrollY,
    rightAbs: bounds.right + scrollX,
    bottomAbs: bounds.bottom + scrollY,
    leftAbs: bounds.left + scrollX,
  };
}

export function getViewportSize(): Size {
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  return {
    width: viewWidth,
    height: viewHeight,

    topView: scrollY,
    rightView: viewWidth,
    bottomView: scrollY + viewHeight,
    leftView: 0,

    topAbs: 0,
    rightAbs: viewWidth,
    bottomAbs: viewHeight,
    leftAbs: 0,
  };
}
