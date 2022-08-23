import Stats from 'three/examples/jsm/libs/stats.module.js';

type statsType = 0 | 1 | 2 | 3;
/**
 * 帧数统计
 * @param type 0: fps 1: ms 2:mb 3+: custom
 * @returns 
 */
export const initStats = (type: statsType) => {
  const stats = Stats();

  stats.showPanel(type);
  document.body.appendChild(stats.dom);
  return stats;
}