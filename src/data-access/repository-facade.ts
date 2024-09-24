import { PhysicalPanelLayoutRepository } from './physical-panel-layout-repository'

export class RepositoryFacade {
  public static createPhysicalPanelLayoutRepository(): PhysicalPanelLayoutRepository {
    return new PhysicalPanelLayoutRepository()
  }
}
