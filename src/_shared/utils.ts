import m from 'mithril';
import { Classes, Style } from '.';

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function safeCall(func: Function, ...args: any[]) {
  if (isFunction(func)) {
    return func(...args);
  }
}

export function getClosest(el: any, selector: string): HTMLElement | null {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      (Element as any).prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      /* tslint:disable */
      function (s) {
        const matches = (this.document || this.ownerDocument).querySelectorAll(s);
        let i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) { }
        return i > -1;
      };
    /* tslint:enable */
  }

  for (; el && el !== document; el = el.parentNode) {
    if (el.matches(selector)) return el;
  }

  return null;
}

export function getScrollbarWidth() {
  const el = document.createElement('div');
  el.style.width = '100px';
  el.style.height = '100px';
  el.style.overflow = 'scroll';
  el.style.position = 'absolute';
  el.style.top = '-9999px';

  document.body.appendChild(el);
  const scrollbarWidth = el.offsetWidth - el.clientWidth;
  document.body.removeChild(el);

  return scrollbarWidth;
}

export function elementIsOrContains(element: HTMLElement, testElement: HTMLElement) {
  return element === testElement || element.contains(testElement);
}

export function normalizeStyle(style: Style) {
  if (typeof style === 'string') {
    const result = {} as Object;
    const attributes = style.replace(/\s/g, '').split(';');

    for (let i = 0; i < attributes.length; i++) {
      const entry = attributes[i].split(':');
      result[entry.splice(0, 1)[0]] = entry.join(':');
    }
    return result;
  } else return style;
}

export function updateElementGroupPadding(containerEl: HTMLElement, contentLeft: m.Vnode, contentRight: m.Vnode) {
  if (!containerEl) return;

  const containerPadding = Math.floor(containerEl.clientHeight / 1.6);

  if (contentLeft) {
    const contentLeftEl = (contentLeft as m.VnodeDOM).dom as HTMLElement;

    containerEl.style.paddingLeft = shouldAddPadding(contentLeftEl)
      ? `${contentLeftEl.clientWidth + containerPadding}px`
      : null;

  } else containerEl.style.paddingLeft = null;

  if (contentRight) {
    const contentRightEl = (contentRight as m.VnodeDOM).dom as HTMLElement;

    containerEl.style.paddingRight = shouldAddPadding(contentRightEl)
      ? `${contentRightEl.clientWidth + containerPadding}px`
      : null;

  } else containerEl.style.paddingRight = null;
}

function shouldAddPadding(element: HTMLElement) {
  return element &&
    !element.classList.contains(Classes.ICON) &&
    !element.classList.contains(Classes.SPINNER) &&
    !element.classList.contains(Classes.BUTTON_ICON);
}
