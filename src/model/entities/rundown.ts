export interface Rundown {
  id: string
  name: string
  mode: RundownMode
}

export enum RundownMode {
  ACTIVE = 'ACTIVE',
  REHEARSAL = 'REHEARSAL',
}
