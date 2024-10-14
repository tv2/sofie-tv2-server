import { PanelServiceImplementation } from '../panel-service-implementation'
import {
  PanelLayoutConfigurationRepository
} from '../../../data-access/interfaces/panel-layout-configuration-repository'
import { PanelConfigurationRepository } from '../../../data-access/interfaces/panel-configuration-repository'
import { PanelEventEmitter } from '../interfaces/panel-event-emitter'
import { anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { PanelService } from '../interfaces/panel-service'
import { NotFoundException } from '../../../model/exceptions/not-found-exception'
import { EntityTestFactory } from '../../../model/test/entity-test-factory'
import { PanelConfiguration } from '../../../model/interfaces/panel-configuration'
import { UnsupportedOperationException } from '../../../model/exceptions/unsupported-operation-exception'
import { PanelLayoutConfiguration } from '../../../model/interfaces/panel-layout-configuration'
import { PanelModel, PanelType, SkaarhojModel } from '../../../model/enums/panel-enums'

describe(PanelServiceImplementation.name, () => {
  describe(PanelServiceImplementation.prototype.createPanelLayoutConfiguration.name, () => {
    it('emits a PanelLayoutConfigurationCreatedEvent', async() => {
      const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()

      const panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
      when(panelLayoutConfigurationRepository.createPanelLayoutConfiguration(panelLayoutConfiguration)).thenReturn(Promise.resolve(panelLayoutConfiguration))

      const panelEventEmitter: PanelEventEmitter = mock<PanelEventEmitter>()

      const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelEventEmitter })
      await testee.createPanelLayoutConfiguration(panelLayoutConfiguration)

      verify(panelEventEmitter.emitPanelLayoutConfigurationCreated(panelLayoutConfiguration)).once()
    })
  })

  describe(PanelServiceImplementation.prototype.updatePanelLayoutConfiguration.name, () => {
    it('emits a PanelLayoutConfigurationUpdatedEvent', async() => {
      const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()
      const panelEventEmitter: PanelEventEmitter = mock<PanelEventEmitter>()

      const testee: PanelService = createTestee({ panelEventEmitter })
      await testee.updatePanelLayoutConfiguration(panelLayoutConfiguration)

      verify(panelEventEmitter.emitPanelLayoutConfigurationUpdated(panelLayoutConfiguration)).once()
    })
  })

  describe(PanelServiceImplementation.prototype.deletePanelLayoutConfiguration.name, () => {
    it('emits a PanelLayoutConfigurationUpdatedEvent', async() => {
      const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()
      const panelEventEmitter: PanelEventEmitter = mock<PanelEventEmitter>()

      const testee: PanelService = createTestee({ panelEventEmitter })
      await testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)

      verify(panelEventEmitter.emitPanelLayoutConfigurationDeleted(panelLayoutConfiguration.id)).once()
    })
  })

  describe(PanelServiceImplementation.prototype.createPanelConfiguration.name, () => {
    describe('no PanelLayoutConfiguration exist for the PanelConfiguration', () => {
      it('throws an Unsupported Operation error', async() => {
        const panelConfiguration: PanelConfiguration = EntityTestFactory.createPanelConfiguration({ panelLayoutConfigurationId: 'nonExistingPanelLayoutConfigurationId' })

        const panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
        when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelConfiguration.panelLayoutConfigurationId)).thenThrow(new NotFoundException(''))

        const testee: PanelService = createTestee({ panelLayoutConfigurationRepository })

        await expect(() => testee.createPanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
      })
    })

    describe('a PanelLayoutConfiguration exits', () => {
      describe('the PanelLayoutConfiguration conforms to the PanelConfiguration', () => {
        it('saves the PanelConfiguration', async() => {
          const panelType: PanelType = PanelType.SKAARHOJ
          const panelModel: PanelModel = SkaarhojModel.MKT1A

          const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ type: panelType, model: panelModel })
          const panelConfiguration: PanelConfiguration = EntityTestFactory.createPanelConfiguration({ type: panelType, model: panelModel, panelLayoutConfigurationId: panelLayoutConfiguration.id })

          const panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelConfiguration.panelLayoutConfigurationId)).thenReturn(Promise.resolve(panelLayoutConfiguration))

          const panelConfigurationRepository: PanelConfigurationRepository = mock<PanelConfigurationRepository>()

          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelConfigurationRepository })

          await testee.createPanelConfiguration(panelConfiguration)

          verify(panelConfigurationRepository.createPanelConfiguration(panelConfiguration)).once()
        })

        it('emits a PanelConfigurationCreatedEvent', async() => {
          const panelType: PanelType = PanelType.SKAARHOJ
          const panelModel: PanelModel = SkaarhojModel.MKT1A

          const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ type: panelType, model: panelModel })
          const panelConfiguration: PanelConfiguration = EntityTestFactory.createPanelConfiguration({ type: panelType, model: panelModel, panelLayoutConfigurationId: panelLayoutConfiguration.id })

          const panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelConfiguration.panelLayoutConfigurationId)).thenReturn(Promise.resolve(panelLayoutConfiguration))

          const panelConfigurationRepository: PanelConfigurationRepository = mock<PanelConfigurationRepository>()
          when(panelConfigurationRepository.createPanelConfiguration(panelConfiguration)).thenReturn(Promise.resolve(panelConfiguration))

          const panelEventEmitter: PanelEventEmitter = mock<PanelEventEmitter>()

          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelConfigurationRepository, panelEventEmitter })

          await testee.createPanelConfiguration(panelConfiguration)

          verify(panelEventEmitter.emitPanelConfigurationCreated(panelConfiguration)).once()
        })
      })

      describe('the PanelLayoutConfiguration.model is not equal to PanelConfiguration.model', () => {
        it('does not save the PanelConfiguration and throws an Unsupported Operation exception', async() => {
          const panelType: PanelType = PanelType.SKAARHOJ
          const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ type: panelType, model: SkaarhojModel.MKT1A })
          const panelConfiguration: PanelConfiguration = EntityTestFactory.createPanelConfiguration({ type: panelType, model: SkaarhojModel.MK48, panelLayoutConfigurationId: panelLayoutConfiguration.id })

          const panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelConfiguration.panelLayoutConfigurationId)).thenReturn(Promise.resolve(panelLayoutConfiguration))

          const panelConfigurationRepository: PanelConfigurationRepository = mock<PanelConfigurationRepository>()

          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelConfigurationRepository })

          await expect(() => testee.createPanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
          verify(panelConfigurationRepository.createPanelConfiguration(anything())).never()
        })
      })

      describe('the PanelLayoutConfiguration.type is not equal to the PanelConfiguration.type', () => {
        it('does not save the PanelConfiguration and throws an Unsupported Operation exception', async() => {
          const panelModel: PanelModel = SkaarhojModel.MK48
          const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ type: PanelType.SKAARHOJ, model: panelModel })
          const panelConfiguration: PanelConfiguration = EntityTestFactory.createPanelConfiguration({ type: 'RANDOM_PANEL_TYPE' as PanelType, model: panelModel, panelLayoutConfigurationId: panelLayoutConfiguration.id })

          const panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelConfiguration.panelLayoutConfigurationId)).thenReturn(Promise.resolve(panelLayoutConfiguration))

          const panelConfigurationRepository: PanelConfigurationRepository = mock<PanelConfigurationRepository>()

          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelConfigurationRepository })

          await expect(() => testee.createPanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
          verify(panelConfigurationRepository.createPanelConfiguration(anything())).never()
        })
      })
    })
  })
})

function createTestee(params?: {
  panelLayoutConfigurationRepository?: PanelLayoutConfigurationRepository
  panelConfigurationRepository?: PanelConfigurationRepository
  panelEventEmitter?: PanelEventEmitter
}): PanelServiceImplementation {
  return new PanelServiceImplementation(
    instance(params?.panelLayoutConfigurationRepository ?? mock<PanelLayoutConfigurationRepository>()),
    instance(params?.panelConfigurationRepository ?? mock<PanelConfigurationRepository>()),
    instance(params?.panelEventEmitter ?? mock<PanelEventEmitter>())
  )
}
