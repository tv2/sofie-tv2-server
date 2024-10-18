import { PanelServiceImplementation } from '../panel-service-implementation'
import {
  PanelLayoutConfigurationRepository
} from '../../../data-access/interfaces/panel-layout-configuration-repository'
import { PanelConfigurationRepository } from '../../../data-access/interfaces/panel-configuration-repository'
import { PanelEventEmitter } from '../interfaces/panel-event-emitter'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
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
    describe('no PanelConfigurations are using the PanelLayoutConfiguration', () => {
      let panelConfigurationRepository: PanelConfigurationRepository
      beforeEach(() => {
        panelConfigurationRepository = mock<PanelConfigurationRepository>()
        when(panelConfigurationRepository.getPanelConfigurationsForPanelLayoutConfiguration(anyString())).thenResolve([])
      })

      it('deletes the PanelLayoutConfiguration', async() => {
        const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()
        const panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()

        const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelConfigurationRepository })
        await testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)

        verify(panelLayoutConfigurationRepository.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)).once()
      })

      it('emits a PanelLayoutConfigurationUpdatedEvent', async() => {
        const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()
        const panelEventEmitter: PanelEventEmitter = mock<PanelEventEmitter>()

        const testee: PanelService = createTestee({ panelEventEmitter, panelConfigurationRepository })
        await testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)

        verify(panelEventEmitter.emitPanelLayoutConfigurationDeleted(panelLayoutConfiguration.id)).once()
      })
    })

    describe('there are PanelConfigurations using the PanelLayoutConfiguration', () => {
      let panelConfigurationRepository: PanelConfigurationRepository
      beforeEach(() => {
        panelConfigurationRepository = mock<PanelConfigurationRepository>()
        when(panelConfigurationRepository.getPanelConfigurationsForPanelLayoutConfiguration(anyString())).thenResolve([
          EntityTestFactory.createPanelConfiguration(),
          EntityTestFactory.createPanelConfiguration()
        ])
      })

      it('does not delete the PanelLayoutConfiguration', async() => {
        const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()
        const panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()

        const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelConfigurationRepository })
        try {
          await testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)
        } catch (error) {
          // The error is expected
        }

        verify(panelLayoutConfigurationRepository.deletePanelLayoutConfiguration(anyString())).never()
      })

      it('does not emit a delete event', async() => {
        const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()
        const panelEventEmitter: PanelEventEmitter = mock<PanelEventEmitter>()

        const testee: PanelService = createTestee({ panelEventEmitter, panelConfigurationRepository })
        try {
          await testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)
        } catch (error) {
          // The error is expected
        }

        verify(panelEventEmitter.emitPanelLayoutConfigurationDeleted(anyString())).never()
      })

      it('throws an unsupported operation exception', async() => {
        const panelLayoutConfiguration: PanelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()

        const testee: PanelService = createTestee({ panelConfigurationRepository })
        await expect(() => testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)).rejects.toThrow(UnsupportedOperationException)
      })
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

    describe('a PanelLayoutConfiguration exists', () => {
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

  describe(PanelServiceImplementation.prototype.updatePanelConfiguration.name, () => {
    describe('no PanelLayoutConfiguration exist for the PanelConfiguration', () => {
      it('throws an Unsupported Operation error', async() => {
        const panelConfiguration: PanelConfiguration = EntityTestFactory.createPanelConfiguration({ panelLayoutConfigurationId: 'nonExistingId' })
        const panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
        when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelConfiguration.panelLayoutConfigurationId)).thenThrow(new NotFoundException(''))

        const testee: PanelService = createTestee({ panelLayoutConfigurationRepository })

        await expect(() => testee.updatePanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
      })
    })

    describe('a PanelLayoutConfiguration exists', () => {
      let panelLayoutConfiguration: PanelLayoutConfiguration
      let panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository
      let panelConfiguration: PanelConfiguration

      describe('the PanelLayout conforms to the PanelConfiguration', () => {
        beforeEach(() => {
          panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()
          panelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve(panelLayoutConfiguration)

          panelConfiguration = EntityTestFactory.createPanelConfiguration({ model: panelLayoutConfiguration.model, type: panelLayoutConfiguration.type, panelLayoutConfigurationId: panelLayoutConfiguration.id })
        })

        it('updates the PanelConfiguration', async() => {
          const panelConfigurationRepository: PanelConfigurationRepository = mock<PanelConfigurationRepository>()

          const testee: PanelService = createTestee({ panelConfigurationRepository, panelLayoutConfigurationRepository })
          await testee.updatePanelConfiguration(panelConfiguration)

          verify(panelConfigurationRepository.updatePanelConfiguration(panelConfiguration)).once()
        })

        it('emits an Updated event', async() => {
          const panelEventEmitter: PanelEventEmitter = mock<PanelEventEmitter>()

          const testee: PanelService = createTestee({ panelEventEmitter, panelLayoutConfigurationRepository })
          await testee.updatePanelConfiguration(panelConfiguration)

          verify(panelEventEmitter.emitPanelConfigurationUpdated(panelConfiguration)).once()
        })
      })

      describe('the PanelLayoutConfiguration.model is not equal to the PanelConfiguration.model', () => {
        beforeEach(() => {
          panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ model: SkaarhojModel.MK48 })
          panelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve(panelLayoutConfiguration)

          panelConfiguration = EntityTestFactory.createPanelConfiguration({ model: SkaarhojModel.MKT1A, panelLayoutConfigurationId: panelLayoutConfiguration.id })
        })

        it('does not update the PanelConfiguration', async() => {
          const panelConfigurationRepository: PanelConfigurationRepository = mock<PanelConfigurationRepository>()

          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelConfigurationRepository })
          try {
            await testee.updatePanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }

          verify(panelConfigurationRepository.updatePanelConfiguration(anything())).never()
        })

        it('does not emit an updated event', async() => {
          const panelEventEmitter: PanelEventEmitter = mock<PanelEventEmitter>()

          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelEventEmitter })
          try {
            await testee.updatePanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }

          verify(panelEventEmitter.emitPanelConfigurationUpdated(anything())).never()
        })

        it('throws an unsupported operation exception', () => {
          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository })
          expect(() => testee.updatePanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
        })
      })

      describe('the PanelLayoutConfiguration.type is not equal to the PanelConfiguration.type', () => {
        beforeEach(() => {
          panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ type: PanelType.SKAARHOJ })
          panelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve(panelLayoutConfiguration)

          panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: 'RANDOM_PANEL_TYPE' as PanelType, panelLayoutConfigurationId: panelLayoutConfiguration.id })
        })

        it('does not update the PanelConfiguration', async() => {
          const panelConfigurationRepository: PanelConfigurationRepository = mock<PanelConfigurationRepository>()

          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelConfigurationRepository })
          try {
            await testee.updatePanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }

          verify(panelConfigurationRepository.updatePanelConfiguration(anything())).never()
        })

        it('does not emit an update event', async() => {
          const panelEventEmitter: PanelEventEmitter = mock<PanelEventEmitter>()

          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository, panelEventEmitter })
          try {
            await testee.updatePanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }

          verify(panelEventEmitter.emitPanelConfigurationUpdated(anything())).never()
        })

        it('throws an unsupported operation exception', () => {
          const testee: PanelService = createTestee({ panelLayoutConfigurationRepository })
          expect(() => testee.updatePanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
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
