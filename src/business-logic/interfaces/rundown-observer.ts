export interface RundownObserver {
  subscribeToRundownActiveRundownId(onActiveRundownIdChangedCallback: (rundownId: string | undefined) => void): void
}
