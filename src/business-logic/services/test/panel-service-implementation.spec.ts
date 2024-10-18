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
import { PanelType, SkaarhojModel } from '../../../model/enums/panel-enums'

describe(PanelServiceImplementation.name, () => {
  let testee: PanelService

  let panelLayoutConfiguration: PanelLayoutConfiguration
  let panelConfiguration: PanelConfiguration

  let panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository
  let panelConfigurationRepository: PanelConfigurationRepository
  let panelEventEmitter: PanelEventEmitter

  beforeEach(() => {
    panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()
    panelConfiguration = EntityTestFactory.createPanelConfiguration()

    panelLayoutConfigurationRepository = mock<PanelLayoutConfigurationRepository>()
    panelConfigurationRepository = mock<PanelConfigurationRepository>()
    panelEventEmitter = mock<PanelEventEmitter>()

    testee = createTestee({ panelLayoutConfigurationRepository, panelConfigurationRepository, panelEventEmitter })
  })

  describe(PanelServiceImplementation.prototype.createPanelLayoutConfiguration.name, () => {
    beforeEach(() => {
      when(panelLayoutConfigurationRepository.createPanelLayoutConfiguration(panelLayoutConfiguration)).thenReturn(Promise.resolve(panelLayoutConfiguration))
    })

    it('saves the PanelLayoutConfiguration', async() => {
      await testee.createPanelLayoutConfiguration(panelLayoutConfiguration)
      verify(panelLayoutConfigurationRepository.createPanelLayoutConfiguration(panelLayoutConfiguration)).once()
    })

    it('emits a PanelLayoutConfigurationCreatedEvent', async() => {
      await testee.createPanelLayoutConfiguration(panelLayoutConfiguration)
      verify(panelEventEmitter.emitPanelLayoutConfigurationCreated(panelLayoutConfiguration)).once()
    })
  })

  describe(PanelServiceImplementation.prototype.updatePanelLayoutConfiguration.name, () => {
    describe('there are PanelConfigurations using the PanelLayoutConfiguration', () => {
      beforeEach(() => {
        when(panelConfigurationRepository.getPanelConfigurationsForPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve([
          EntityTestFactory.createPanelConfiguration()
        ])
      })

      it('does not update the PanelLayoutConfiguration', async() => {
        try {
          await testee.updatePanelLayoutConfiguration(panelLayoutConfiguration)
        } catch (error) {
          // Expected error
        }
        verify(panelLayoutConfigurationRepository.updatePanelLayoutConfiguration(anything())).never()
      })

      it('does not emit an update event', async() => {
        try {
          await testee.updatePanelLayoutConfiguration(panelLayoutConfiguration)
        } catch (error) {
          // Expected error
        }
        verify(panelEventEmitter.emitPanelLayoutConfigurationUpdated(anything())).never()
      })

      it('throws an unsupported operation exception', () => {
        expect(() => testee.updatePanelLayoutConfiguration(panelLayoutConfiguration)).rejects.toThrow(UnsupportedOperationException)
      })
    })

    describe('there are no PanelConfigurations using the PanelLayoutConfiguration', () => {
      beforeEach(() => {
        when(panelConfigurationRepository.getPanelConfigurationsForPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve([])
      })

      it('updates the panelLayoutConfiguration', async() => {
        await testee.updatePanelLayoutConfiguration(panelLayoutConfiguration)
        verify(panelLayoutConfigurationRepository.updatePanelLayoutConfiguration(panelLayoutConfiguration)).once()
      })

      it('emits a PanelLayoutConfigurationUpdatedEvent', async() => {
        await testee.updatePanelLayoutConfiguration(panelLayoutConfiguration)
        verify(panelEventEmitter.emitPanelLayoutConfigurationUpdated(panelLayoutConfiguration)).once()
      })
    })
  })

  describe(PanelServiceImplementation.prototype.deletePanelLayoutConfiguration.name, () => {
    describe('no PanelConfigurations are using the PanelLayoutConfiguration', () => {
      beforeEach(() => {
        when(panelConfigurationRepository.getPanelConfigurationsForPanelLayoutConfiguration(anyString())).thenResolve([])
      })

      it('deletes the PanelLayoutConfiguration', async() => {
        await testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)
        verify(panelLayoutConfigurationRepository.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)).once()
      })

      it('emits a PanelLayoutConfigurationUpdatedEvent', async() => {
        await testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)
        verify(panelEventEmitter.emitPanelLayoutConfigurationDeleted(panelLayoutConfiguration.id)).once()
      })
    })

    describe('there are PanelConfigurations using the PanelLayoutConfiguration', () => {
      beforeEach(() => {
        when(panelConfigurationRepository.getPanelConfigurationsForPanelLayoutConfiguration(anyString())).thenResolve([
          EntityTestFactory.createPanelConfiguration(),
          EntityTestFactory.createPanelConfiguration()
        ])
      })

      it('does not delete the PanelLayoutConfiguration', async() => {
        try {
          await testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)
        } catch (error) {
          // The error is expected
        }
        verify(panelLayoutConfigurationRepository.deletePanelLayoutConfiguration(anyString())).never()
      })

      it('does not emit a delete event', async() => {
        try {
          await testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)
        } catch (error) {
          // The error is expected
        }
        verify(panelEventEmitter.emitPanelLayoutConfigurationDeleted(anyString())).never()
      })

      it('throws an unsupported operation exception', async() => {
        const testee: PanelService = createTestee({ panelConfigurationRepository })
        await expect(() => testee.deletePanelLayoutConfiguration(panelLayoutConfiguration.id)).rejects.toThrow(UnsupportedOperationException)
      })
    })
  })

  describe(PanelServiceImplementation.prototype.createPanelConfiguration.name, () => {
    describe('no PanelLayoutConfiguration exist for the PanelConfiguration', () => {
      beforeEach(() => {
        panelConfiguration = EntityTestFactory.createPanelConfiguration({ panelLayoutConfigurationId: 'nonExistingPanelLayoutConfigurationId' })
        when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelConfiguration.panelLayoutConfigurationId)).thenThrow(new NotFoundException(''))
      })

      it('throws an Unsupported Operation error', async() => {
        await expect(() => testee.createPanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
      })
    })

    describe('a PanelLayoutConfiguration exists', () => {
      describe('the PanelLayoutConfiguration conforms to the PanelConfiguration', () => {
        beforeEach(() => {
          panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ model: SkaarhojModel.MK48, type: PanelType.SKAARHOJ })
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve(panelLayoutConfiguration)

          panelConfiguration = EntityTestFactory.createPanelConfiguration({ model: panelLayoutConfiguration.model, type: panelLayoutConfiguration.type, panelLayoutConfigurationId: panelLayoutConfiguration.id })
          when(panelConfigurationRepository.createPanelConfiguration(panelConfiguration)).thenResolve(panelConfiguration)
        })

        it('saves the PanelConfiguration', async() => {
          await testee.createPanelConfiguration(panelConfiguration)
          verify(panelConfigurationRepository.createPanelConfiguration(panelConfiguration)).once()
        })

        it('emits a PanelConfigurationCreatedEvent', async() => {
          await testee.createPanelConfiguration(panelConfiguration)
          verify(panelEventEmitter.emitPanelConfigurationCreated(panelConfiguration)).once()
        })
      })

      describe('the PanelLayoutConfiguration.model is not equal to PanelConfiguration.model', () => {
        beforeEach(() => {
          panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ model: SkaarhojModel.MK48 })
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve(panelLayoutConfiguration)

          panelConfiguration = EntityTestFactory.createPanelConfiguration({ model: SkaarhojModel.MKT1A, panelLayoutConfigurationId: panelLayoutConfiguration.id })
          when(panelConfigurationRepository.createPanelConfiguration(panelConfiguration)).thenResolve(panelConfiguration)
        })

        it('does not save the PanelConfiguration', async() => {
          try {
            await testee.createPanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }
          verify(panelConfigurationRepository.createPanelConfiguration(anything())).never()
        })

        it('does not emit a created event', async() => {
          try {
            await testee.createPanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }
          verify(panelEventEmitter.emitPanelConfigurationCreated(anything())).never()
        })

        it('throws an unsupported operation exception', async() => {
          await expect(() => testee.createPanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
        })
      })

      describe('the PanelLayoutConfiguration.type is not equal to the PanelConfiguration.type', () => {
        beforeEach(() => {
          panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ type: PanelType.SKAARHOJ })
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve(panelLayoutConfiguration)

          panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: 'RANDOM_PANEL_TYPE' as PanelType, model: panelLayoutConfiguration.model, panelLayoutConfigurationId: panelLayoutConfiguration.id })
        })

        it('does not save the PanelConfiguration', async() => {
          try {
            await testee.createPanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }
          verify(panelConfigurationRepository.createPanelConfiguration(anything())).never()
        })

        it('does not emit a created event', async() => {
          try {
            await testee.createPanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }
          verify(panelEventEmitter.emitPanelConfigurationCreated(anything())).never()
        })

        it('throws an unsupported operation exception', async() => {
          await expect(() => testee.createPanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
        })
      })
    })
  })

  describe(PanelServiceImplementation.prototype.updatePanelConfiguration.name, () => {
    describe('no PanelLayoutConfiguration exist for the PanelConfiguration', () => {
      beforeEach(() => {
        panelConfiguration = EntityTestFactory.createPanelConfiguration({ panelLayoutConfigurationId: 'nonExistingId' })
        when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelConfiguration.panelLayoutConfigurationId)).thenThrow(new NotFoundException(''))
      })

      it('throws an Unsupported Operation error', async() => {
        await expect(() => testee.updatePanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
      })
    })

    describe('a PanelLayoutConfiguration exists', () => {
      describe('the PanelLayout conforms to the PanelConfiguration', () => {
        beforeEach(() => {
          panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration()
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve(panelLayoutConfiguration)

          panelConfiguration = EntityTestFactory.createPanelConfiguration({ model: panelLayoutConfiguration.model, type: panelLayoutConfiguration.type, panelLayoutConfigurationId: panelLayoutConfiguration.id })
        })

        it('updates the PanelConfiguration', async() => {
          await testee.updatePanelConfiguration(panelConfiguration)
          verify(panelConfigurationRepository.updatePanelConfiguration(panelConfiguration)).once()
        })

        it('emits an Updated event', async() => {
          await testee.updatePanelConfiguration(panelConfiguration)
          verify(panelEventEmitter.emitPanelConfigurationUpdated(panelConfiguration)).once()
        })
      })

      describe('the PanelLayoutConfiguration.model is not equal to the PanelConfiguration.model', () => {
        beforeEach(() => {
          panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ model: SkaarhojModel.MK48 })
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve(panelLayoutConfiguration)

          panelConfiguration = EntityTestFactory.createPanelConfiguration({ model: SkaarhojModel.MKT1A, panelLayoutConfigurationId: panelLayoutConfiguration.id })
        })

        it('does not update the PanelConfiguration', async() => {
          try {
            await testee.updatePanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }
          verify(panelConfigurationRepository.updatePanelConfiguration(anything())).never()
        })

        it('does not emit an updated event', async() => {
          try {
            await testee.updatePanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }
          verify(panelEventEmitter.emitPanelConfigurationUpdated(anything())).never()
        })

        it('throws an unsupported operation exception', () => {
          expect(() => testee.updatePanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
        })
      })

      describe('the PanelLayoutConfiguration.type is not equal to the PanelConfiguration.type', () => {
        beforeEach(() => {
          panelLayoutConfiguration = EntityTestFactory.createPanelLayoutConfiguration({ type: PanelType.SKAARHOJ })
          when(panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfiguration.id)).thenResolve(panelLayoutConfiguration)

          panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: 'RANDOM_PANEL_TYPE' as PanelType, panelLayoutConfigurationId: panelLayoutConfiguration.id })
        })

        it('does not update the PanelConfiguration', async() => {
          try {
            await testee.updatePanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }
          verify(panelConfigurationRepository.updatePanelConfiguration(anything())).never()
        })

        it('does not emit an update event', async() => {
          try {
            await testee.updatePanelConfiguration(panelConfiguration)
          } catch (error) {
            // Expected error
          }
          verify(panelEventEmitter.emitPanelConfigurationUpdated(anything())).never()
        })

        it('throws an unsupported operation exception', () => {
          expect(() => testee.updatePanelConfiguration(panelConfiguration)).rejects.toThrow(UnsupportedOperationException)
        })
      })
    })
  })

  describe(PanelServiceImplementation.prototype.deletePanelConfiguration.name, () => {
    it('deletes the PanelConfiguration', async() => {
      await testee.deletePanelConfiguration(panelConfiguration.id)
      verify(panelConfigurationRepository.deletePanelConfiguration(panelConfiguration.id)).once()
    })

    it('emits a deleted event', async() => {
      await testee.deletePanelConfiguration(panelConfiguration.id)
      verify(panelEventEmitter.emitPanelConfigurationDeleted(panelConfiguration.id)).once()
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
