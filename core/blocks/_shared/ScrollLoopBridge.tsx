import React from 'react';
import { LoopSeam, type LoopSeamProps } from './LoopSeam';

export interface ScrollLoopBridgeProps extends LoopSeamProps {}

/**
 * @deprecated Use LoopSeam after footer — runway only, no children.
 */
export const ScrollLoopBridge: React.FC<ScrollLoopBridgeProps> = (props) => (
  <LoopSeam {...props} />
);

ScrollLoopBridge.displayName = 'ScrollLoopBridge';
