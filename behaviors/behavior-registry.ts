/**
 * Behavior Registry
 * 
 * A centralised registry of behavior configurations. Backend, AI, or config
 * files specify behavior by ID; the renderer looks up the config here and
 * binds the actual handler at the application layer.
 *
 * Usage:
 *   import { behaviorRegistry, registerBehavior, getBehavior } from './behavior-registry';
 *   registerBehavior('goToDashboard', { type: 'navigate', payload: { route: '/dashboard' } });
 *   const cfg = getBehavior('goToDashboard'); // → BehaviorConfig
 */

import type { BehaviorId, BehaviorConfig, BuiltinBehaviorType, PayloadSchema } from './behavior-types';
import { BUILTIN_PAYLOAD_SCHEMAS } from './behavior-types';

// =============================================================================
// REGISTRY STORE
// =============================================================================

const registry: Map<BehaviorId, BehaviorConfig> = new Map();

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Validate a behavior's payload against its schema (or the built-in schema for its type).
 * Returns an array of error messages, empty if valid.
 */
export function validateBehaviorPayload(config: BehaviorConfig): string[] {
  const schema = config.payloadSchema ?? BUILTIN_PAYLOAD_SCHEMAS[config.type];
  if (!schema) return [];

  const errors: string[] = [];
  const payload = config.payload ?? {};

  // Check required keys
  if (schema.required) {
    for (const key of schema.required) {
      if (!(key in payload)) {
        errors.push(`Missing required payload key: "${key}" for behavior type "${config.type}"`);
      }
    }
  }

  // Check property types
  if (schema.properties) {
    for (const [key, expectedType] of Object.entries(schema.properties)) {
      if (key in payload) {
        const actual = payload[key];
        const actualType = Array.isArray(actual) ? 'array' : typeof actual;
        if (actualType !== expectedType) {
          errors.push(`Payload key "${key}" expected type "${expectedType}" but got "${actualType}"`);
        }
      }
    }
  }

  return errors;
}

/**
 * Register a behavior config by ID.
 * Validates payload against schema if present.
 * Throws if the ID is already registered (call `unregisterBehavior` first to replace).
 */
export function registerBehavior(id: BehaviorId, config: BehaviorConfig): void {
  if (registry.has(id)) {
    throw new Error(`Behavior "${id}" is already registered. Unregister it first to replace.`);
  }

  // Validate payload against schema
  const payloadErrors = validateBehaviorPayload(config);
  if (payloadErrors.length > 0) {
    throw new Error(`Invalid payload for behavior "${id}": ${payloadErrors.join('; ')}`);
  }

  registry.set(id, Object.freeze({ ...config }));
}

/**
 * Get a behavior config by ID. Returns undefined if not found.
 */
export function getBehavior(id: BehaviorId): BehaviorConfig | undefined {
  return registry.get(id);
}

/**
 * Check if a behavior is registered.
 */
export function hasBehavior(id: BehaviorId): boolean {
  return registry.has(id);
}

/**
 * Unregister a behavior. Silently does nothing if ID is not found.
 */
export function unregisterBehavior(id: BehaviorId): void {
  registry.delete(id);
}

/**
 * Get all registered behavior IDs.
 */
export function listBehaviors(): BehaviorId[] {
  return Array.from(registry.keys());
}

/**
 * Get the full registry snapshot (read-only).
 */
export function getRegistrySnapshot(): ReadonlyMap<BehaviorId, Readonly<BehaviorConfig>> {
  return new Map(registry);
}

/**
 * Clear all registered behaviors. Useful for testing.
 */
export function clearBehaviorRegistry(): void {
  registry.clear();
}

// =============================================================================
// DEFAULT BEHAVIORS
// =============================================================================

/**
 * Register a set of default / built-in behaviors.
 * Called once during app bootstrap. Safe to call multiple times
 * (skips already-registered IDs).
 */
export function registerDefaultBehaviors(): void {
  const defaults: Array<[BehaviorId, BehaviorConfig]> = [
    ['navigate', { type: 'navigate', description: 'Navigate to a route', payload: {} }],
    ['submit',   { type: 'submit',   description: 'Submit the nearest form', payload: {} }],
    ['openModal',  { type: 'openModal',  description: 'Open a modal by name', payload: {} }],
    ['closeModal', { type: 'closeModal', description: 'Close the current modal', payload: {} }],
    ['toggle',   { type: 'toggle',   description: 'Toggle a boolean state', payload: {} }],
  ];

  for (const [id, config] of defaults) {
    if (!registry.has(id)) {
      registry.set(id, Object.freeze({ ...config }));
    }
  }
}
