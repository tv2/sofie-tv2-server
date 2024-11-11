import { Rundown } from '../../model/entities/rundown'

export interface RundownService {
  getRundown(rundownId: string): Promise<Rundown>
  getActiveRundown(): Promise<Rundown | undefined>
}
