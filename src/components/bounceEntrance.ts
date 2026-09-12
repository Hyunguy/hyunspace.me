// Each group staggers independently so a long list never delays the whole screen.
export function bounceEntrance(groups: HTMLElement[][]) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return () => {};
  const animations = groups.flatMap(group => group.map((element, index) => {
    const rect = element.getBoundingClientRect();
    const fromRight = rect.left + rect.width / 2 >= window.innerWidth / 2;
    const direction = fromRight ? 1 : -1;
    const start = fromRight ? window.innerWidth - rect.left + 24 : -rect.right - 24;
    return element.animate([
      { transform: `translateX(${start}px)`, opacity: 0, offset: 0 },
      { opacity: 1, offset: 0.18 },
      { transform: `translateX(${-24 * direction}px)`, opacity: 1, offset: 0.52 },
      { transform: `translateX(${10 * direction}px)`, offset: 0.73 },
      { transform: `translateX(${-3 * direction}px)`, offset: 0.89 },
      { transform: 'translateX(0)', opacity: 1, offset: 1 },
    ], { duration: 850, delay: 80 + index * 110, easing: 'cubic-bezier(0.22, 0.7, 0.3, 1)', fill: 'backwards' });
  }));
  const cancel = () => animations.forEach(animation => animation.cancel());
  motion.addEventListener('change', cancel);
  window.addEventListener('resize', cancel);
  return () => {
    cancel();
    motion.removeEventListener('change', cancel);
    window.removeEventListener('resize', cancel);
  };
}
