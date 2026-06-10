/**
 * Behaviors Module
 * 
 * Re-exports types and the registry for UI behaviors.
 */

export type {
  BehaviorId,
  BehaviorConfig,
  BuiltinBehaviorType,
  NodeBehaviors,
  InteractiveState,
  StateTransition,
  InteractiveStateMachine,
  PayloadSchema,
} from './behavior-types';

export { BUILTIN_PAYLOAD_SCHEMAS } from './behavior-types';

export {
  registerBehavior,
  getBehavior,
  hasBehavior,
  unregisterBehavior,
  listBehaviors,
  getRegistrySnapshot,
  clearBehaviorRegistry,
  registerDefaultBehaviors,
  validateBehaviorPayload,
} from './behavior-registry';

/** Generated from spec (npm run behaviors:generate). State machines and focus config per component. */
export {
  COMPONENT_IDS,
  COMPONENT_STATE_MACHINES,
  COMPONENT_FOCUS_RINGS,
  getComponentStateMachine,
  getComponentFocusRing,
  registerComponentBehaviors,
} from './generated/component-behaviors';
