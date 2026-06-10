/**
 * Behavior Registry — Types
 * 
 * Defines the contract for UI behaviors that can be attached to nodes
 * via layout specs or backend contracts. The registry holds configs,
 * NOT the actual handlers — handlers are bound by the application layer.
 */

// =============================================================================
// BUILT-IN BEHAVIOR TYPES
// =============================================================================

export type BuiltinBehaviorType =
  | 'navigate'
  | 'submit'
  | 'openModal'
  | 'closeModal'
  | 'toggle'
  | 'custom';

// =============================================================================
// INTERACTIVE STATES & TRANSITIONS
// =============================================================================

/**
 * Standard interactive states for UI elements.
 * Maps visual state tokens to behavioral states.
 */
export type InteractiveState =
  | 'idle'
  | 'hovered'
  | 'focused'
  | 'pressed'
  | 'active'
  | 'disabled'
  | 'loading';

/**
 * Describes a valid transition between interactive states.
 */
export interface StateTransition {
  from: InteractiveState;
  to: InteractiveState;
  trigger: string;  // e.g. 'mouseenter', 'mousedown', 'focus', 'blur', 'click'
}

/**
 * State machine definition for a UI element's interactive behavior.
 * Connects visual tokens (colors, effects) to behavioral states.
 */
export interface InteractiveStateMachine {
  /** Initial state (usually 'idle') */
  initial: InteractiveState;
  /** Allowed states for this element */
  states: InteractiveState[];
  /** Valid transitions */
  transitions: StateTransition[];
  /** Maps each state to a set of token overrides (e.g. background, border color) */
  stateTokens?: Partial<Record<InteractiveState, Record<string, string>>>;
}

// =============================================================================
// PAYLOAD SCHEMAS (for validation)
// =============================================================================

/**
 * Describes the expected shape of a behavior's payload.
 * Used for runtime validation when registering or invoking behaviors.
 */
export interface PayloadSchema {
  /** Required keys that must be present in payload */
  required?: string[];
  /** Optional keys with their expected types */
  properties?: Record<string, 'string' | 'number' | 'boolean' | 'object' | 'array'>;
}

/** Built-in payload schemas for standard behavior types */
export const BUILTIN_PAYLOAD_SCHEMAS: Partial<Record<BuiltinBehaviorType, PayloadSchema>> = {
  navigate: { required: ['route'], properties: { route: 'string', params: 'object' } },
  submit: { properties: { formId: 'string', action: 'string' } },
  openModal: { required: ['modalName'], properties: { modalName: 'string', props: 'object' } },
  closeModal: { properties: { modalName: 'string' } },
  toggle: { required: ['target'], properties: { target: 'string' } },
};

// =============================================================================
// BEHAVIOR CONFIG
// =============================================================================

export interface BehaviorConfig {
  /** Behavior type identifier */
  type: BuiltinBehaviorType;

  /** Human-readable description */
  description?: string;

  /** Arbitrary payload for the handler (route, form ID, modal name, etc.) */
  payload?: Record<string, unknown>;

  /**
   * Optional handler reference (string key) — the application layer resolves
   * this to an actual function at runtime.
   */
  handler?: string;

  /** Optional payload schema for validation */
  payloadSchema?: PayloadSchema;

  /** Optional state machine for interactive state management */
  stateMachine?: InteractiveStateMachine;
}

// =============================================================================
// BEHAVIOR ID
// =============================================================================

/**
 * A string identifier used in layout specs and backend contracts
 * to reference a registered behavior.
 */
export type BehaviorId = string;

// =============================================================================
// NODE BEHAVIORS
// =============================================================================

/**
 * Attach behaviors to specific events on a layout node or component.
 * Keys are event names (click, hover, focus, etc.).
 */
export interface NodeBehaviors {
  click?: BehaviorId;
  hover?: BehaviorId;
  focus?: BehaviorId;
  submit?: BehaviorId;
  change?: BehaviorId;
  [event: string]: BehaviorId | undefined;
}
