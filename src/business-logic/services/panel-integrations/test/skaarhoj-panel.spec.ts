import { SkaarhojPanel } from '../skaarhoj-panel'
import { PanelConfiguration } from '../../../../model/interfaces/panel-configuration'
import { EntityTestFactory } from '../../../../model/test/entity-test-factory'
import { PanelModel, PanelType, SkaarhojModel } from '../../../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../../../model/exceptions/unsupported-operation-exception'
import { Logger } from '../../../../logger/logger'
import { mock } from '@typestrong/ts-mockito'

describe(SkaarhojPanel.name, () => {
  let panelConfiguration: PanelConfiguration
  let logger: Logger

  beforeEach(() => {
    logger = mock<Logger>()
  })

  describe('on creation', () => {
    describe('it receives a PanelConfiguration that does not have a Skaarhoj type', () => {
      it('throws an unsupported operation exception', () => {
        panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: 'NON_SKAARHOJ_TYPE' as PanelType, model: SkaarhojModel.MKT1A })
        expect(() => new SkaarhojPanel(panelConfiguration, logger)).toThrow(UnsupportedOperationException)
      })
    })

    describe('it receives a PanelConfiguration that does not have a Skaarhoj model', () => {
      it('throws an unsupported operation exception', () => {
        panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: PanelType.SKAARHOJ, model: 'NON_SKAARHOJ_MODEL' as PanelModel })
        expect(() => new SkaarhojPanel(panelConfiguration, logger)).toThrow(UnsupportedOperationException)
      })
    })

    describe('it receives a PanelConfiguration with Skaarhoj type and model', () => {
      it('does not throw any exception', () => {
        panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: PanelType.SKAARHOJ, model: SkaarhojModel.MK48 })
        try {
          new SkaarhojPanel(panelConfiguration, logger)
        } catch (error) {
          // If we come in here, we had an error thrown which means we should fail the test.
          expect(true).toBeFalsy()
        }
      })
    })
  })
})
