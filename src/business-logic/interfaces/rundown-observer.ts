export interface RundownObserver {
  subscribeToActiveRundownId(onActiveRundownIdChangedCallback: (rundownId: string | undefined) => void): void
}
