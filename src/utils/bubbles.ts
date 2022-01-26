import * as d3 from 'd3';
import {Member} from '../@types';

export const packBubbles = (
  data: Member[],
  width: number,
  height: number,
): any =>
  d3
    .pack()
    .size([width - 2, height - 2])
    .padding(3)(
    d3.hierarchy({children: data}).sum(l => (l as any).order % 3 || 1),
  );

export const getBubbleTitleSize = (total: number) => {
  // let size = 0;
  // if (total > 10) {
  //   size = 10;
  // } else if (total >= 5 && total < 10) {
  //   size = 14;
  // } else {
  //   size = 28;
  // }
  return 24 - total + 1;
};
