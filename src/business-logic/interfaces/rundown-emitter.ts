export interface RundownEmitter {
  /**
   * Emits what the new active RundownId is.
   * If there is no longer an active Rundown (i.e., on deactivation), then emit 'undefined'.
   */
  emitActiveRundownId(rundownId: string | undefined): void
}
