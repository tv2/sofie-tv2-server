import { HttpService } from '../interfaces/http-service'
import { Rundown, RundownMode } from '../../model/entities/rundown'
import { RundownService } from '../interfaces/rundown-service'

const RUNDOWN_ENDPOINT: string = '/rundowns'
const BASIC_RUNDOWNS_ENDPOINT: string = `${RUNDOWN_ENDPOINT}/basic`

export class RundownHttpService implements RundownService {
  public constructor(private readonly httpService: HttpService) {}

  public async getRundown(rundownId: string): Promise<Rundown> {
    return this.httpService.get(`${RUNDOWN_ENDPOINT}/${rundownId}`) as Promise<Rundown>
  }

  public async getActiveRundown(): Promise<Rundown | undefined> {
    const rundowns: Rundown[] = await this.httpService.get(BASIC_RUNDOWNS_ENDPOINT) as Rundown[]
    return rundowns.find(rundown => rundown.mode === RundownMode.ACTIVE || rundown.mode === RundownMode.REHEARSAL)
  }
}
