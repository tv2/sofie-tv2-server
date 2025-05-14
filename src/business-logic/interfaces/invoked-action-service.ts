export interface InvokedActionService {
  subscribeToInvokedActionIds(subscriberId: string, callback: (invokedActionIds: string[]) => void): void
  unsubscribeFromInvokedActionIds(subscriberId: string): void
}
