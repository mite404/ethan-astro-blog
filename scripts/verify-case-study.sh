#!/usr/bin/env bash
# Requires the running site and agent-browser; catches missing hover wiring and orphaned previews.
set -euo pipefail
session=case-study-check
trap 'agent-browser --session "$session" close >/dev/null 2>&1' EXIT
agent-browser --session "$session" open "${1:-http://localhost:4321}"
agent-browser --session "$session" set viewport 1440 1000 2
agent-browser --session "$session" wait --load networkidle
agent-browser --session "$session" wait --fn "document.querySelector('#project-case-study')?.hasAttribute('data-ready')"
agent-browser --session "$session" eval "(() => {
  if (!document.querySelector('#project-case-study')) throw new Error('Case-study popover missing');
  document.querySelector('.project-card').scrollIntoView({ block: 'center', behavior: 'instant' });
  return 'Case-study present';
})()"
agent-browser --session "$session" eval "new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))"
for index in 1 2 3 4; do
  agent-browser --session "$session" hover ".project-card:nth-child($index)"
  agent-browser --session "$session" wait --fn "document.querySelector('#project-case-study').matches(':popover-open')"
  agent-browser --session "$session" hover '#case-title'
  agent-browser --session "$session" eval "new Promise((resolve, reject) => setTimeout(() => {
    if (!document.querySelector('#project-case-study').matches(':popover-open')) reject(new Error('Hover bridge closed the panel'));
    else resolve('Hover bridge retained the panel');
  }, 400))"
  if [ "$index" = 1 ]; then
    agent-browser --session "$session" eval "(() => {
      const panel = document.querySelector('#project-case-study');
      const root = document.documentElement;
      const originalClass = root.className;
      try {
        for (const theme of ['light', 'dark']) {
          root.classList.remove('light', 'dark');
          root.classList.add(theme);
          for (const element of [panel, ...panel.querySelectorAll('.case-preview')]) {
            const c = getComputedStyle(element);
            if (c.backgroundColor !== 'rgb(28, 28, 28)' || c.color !== 'rgba(255, 255, 255, 0.9)')
              throw new Error('Portfolio popover follows the blog theme instead of staying dark');
          }
          if (getComputedStyle(panel.querySelector('pre')).color !== 'rgba(255, 255, 255, 0.9)')
            throw new Error('Code preview keeps light-theme text on a dark background');
        }
      } finally {
        root.className = originalClass;
      }
      const close = panel.querySelector('.case-close').getBoundingClientRect();
      const icon = panel.querySelector('.case-close svg').getBoundingClientRect();
      if (Math.abs(close.left + close.width / 2 - icon.left - icon.width / 2) > 0.5 ||
          Math.abs(close.top + close.height / 2 - icon.top - icon.height / 2) > 0.5)
        throw new Error('Close icon is off center');
      const elements = [...panel.querySelectorAll('h2, h3, p, code, em')];
      const read = () => elements.map(e => {
        const c = getComputedStyle(e);
        return [c.fontFamily, c.fontSize, c.fontWeight, c.lineHeight, c.margin, c.color];
      });
      const before = JSON.stringify(read());
      const style = document.createElement('style');
      style.textContent = '.prose h2, .prose h3, .prose p, .prose code, .prose em { font-size: 41px !important; margin: 90px !important; color: red !important; }';
      document.head.append(style);
      const after = JSON.stringify(read());
      style.remove();
      if (before !== after) throw new Error('Blog styling changed the case study');
      return 'Blog style changes leave case-study typography unchanged';
    })()"
  fi
  agent-browser --session "$session" press Escape
done
agent-browser --session "$session" hover '.project-card'
agent-browser --session "$session" hover '[data-case-preview="case-receipt"]'
agent-browser --session "$session" wait --fn "document.querySelector('#case-receipt').matches(':popover-open')"
agent-browser --session "$session" mouse move 10 10
agent-browser --session "$session" wait --fn "document.querySelectorAll(':popover-open').length === 0"
agent-browser --session "$session" click '.case-study-trigger'
for preview in threads receipt work motion schema loop; do
  read -r x y < <(agent-browser --session "$session" eval "(() => {
    const trigger = document.querySelector('[data-case-preview=\"case-$preview\"]');
    trigger.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    const rect = trigger.getClientRects()[0];
    return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
  })()" | jq -r '[.x, .y] | @tsv')
  agent-browser --session "$session" mouse move "$x" "$y"
  agent-browser --session "$session" wait --fn "document.querySelector('#case-$preview').matches(':popover-open')"
  agent-browser --session "$session" wait --fn "(() => {
    const asset = document.querySelector('#case-$preview');
    const image = asset.querySelector('img');
    return image ? image.naturalWidth > 0 : asset.querySelector('pre code')?.textContent.trim().length > 0;
  })()"
  agent-browser --session "$session" eval "(() => {
    const panel = document.querySelector('#project-case-study').getBoundingClientRect();
    const asset = document.querySelector('#case-$preview').getBoundingClientRect();
    const overlap = Math.min(panel.right, asset.right) - Math.max(panel.left, asset.left);
    if (overlap < asset.width * 0.8) throw new Error('Asset sits beside the case study instead of over it');
    if (getComputedStyle(document.querySelector('#case-$preview .case-asset-close')).display !== 'none')
      throw new Error('Desktop hover asset shows a close button');
    return 'Preview overlays the case study';
  })()"
  agent-browser --session "$session" mouse move 10 10
  agent-browser --session "$session" wait --fn "!document.querySelector('.case-preview:popover-open')"
  agent-browser --session "$session" mouse move "$x" "$y"
  agent-browser --session "$session" wait --fn "document.querySelector('#case-$preview').matches(':popover-open')"
  agent-browser --session "$session" press Escape
  agent-browser --session "$session" eval "new Promise((resolve, reject) => setTimeout(() => {
    if (document.querySelector('.case-preview:popover-open')) reject(new Error('$preview preview reopened after Escape'));
    else if (!document.querySelector('#project-case-study').matches(':popover-open')) reject(new Error('$preview Escape closed the parent'));
    else resolve('Escape keeps the preview dismissed');
  }, 300))"
done
agent-browser --session "$session" eval "(() => {
  if (document.querySelector('.case-preview:popover-open')) throw new Error('Preview did not close');
  if (!document.querySelector('#project-case-study').matches(':popover-open')) throw new Error('Escape closed the case study before the preview');
  return 'Preview dismissed independently';
})()"
agent-browser --session "$session" set viewport 390 844 2
agent-browser --session "$session" eval "new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))"
agent-browser --session "$session" eval "(() => {
  const panel = document.querySelector('#project-case-study');
  const rect = panel.getBoundingClientRect();
  if (rect.left < 0 || rect.right > innerWidth || rect.top < 0 || rect.bottom > innerHeight) throw new Error('Popover escapes narrow viewport');
  if (rect.left < 32 || innerWidth - rect.right < 32 || rect.top < 32 || innerHeight - rect.bottom < 32)
    throw new Error('Mobile window needs 32px exterior gutters');
  if (getComputedStyle(panel).padding !== '20px') throw new Error('Mobile inner padding changed');
  if (panel.scrollWidth > panel.clientWidth) throw new Error('Horizontal content overflow');
  panel.scrollTop = panel.scrollHeight;
  const footer = panel.querySelector('.case-hint').getBoundingClientRect();
  if (footer.bottom > rect.bottom) throw new Error('Footer cannot be reached by scrolling');
  return 'Narrow layout stays in bounds and scrolls to footer';
})()"
for preview in threads schema; do
  agent-browser --session "$session" click "[data-case-preview=\"case-$preview\"]"
  agent-browser --session "$session" wait --fn "document.querySelector('#case-$preview').matches(':popover-open')"
  agent-browser --session "$session" eval "(() => {
    const preview = document.querySelector('#case-$preview');
    const rect = preview.getBoundingClientRect();
    if (rect.left < 32 || innerWidth - rect.right < 32 || rect.top < 32 || innerHeight - rect.bottom < 32)
      throw new Error('Asset preview loses mobile exterior gutters');
    const button = preview.querySelector('.case-asset-close');
    const close = button.getBoundingClientRect();
    const icon = button.querySelector('svg').getBoundingClientRect();
    if (close.width !== 44 || close.height !== 44) throw new Error('Mobile asset close target is missing');
    if (Math.abs(close.left + close.width / 2 - icon.left - icon.width / 2) > 0.5 ||
        Math.abs(close.top + close.height / 2 - icon.top - icon.height / 2) > 0.5)
      throw new Error('Mobile asset cross is off center');
    if (location.hash) throw new Error('Keyword navigated instead of opening a preview');
    return 'Mobile asset has a centered close button and exterior gutters';
  })()"
  agent-browser --session "$session" click "#case-$preview .case-asset-close"
  agent-browser --session "$session" wait --fn "!document.querySelector('#case-$preview').matches(':popover-open')"
  agent-browser --session "$session" eval "(() => {
    if (!document.querySelector('#project-case-study').matches(':popover-open')) throw new Error('Asset close dismissed the case study');
    return 'Asset close retains the case study';
  })()"
done
agent-browser --session "$session" press Escape
agent-browser --session "$session" focus '.case-study-trigger'
agent-browser --session "$session" press Enter
agent-browser --session "$session" wait --fn "document.querySelector('#project-case-study').matches(':popover-open')"
agent-browser --session "$session" click '#project-case-study > .case-header > .case-close'
agent-browser --session "$session" eval "(() => {
  if (document.querySelector(':popover-open')) throw new Error('Orphaned popover');
  return 'PASS: isolated typography, four project hovers, four images, two code previews, overlay placement, Escape cleanup, narrow layout, keyboard entry';
})()"
