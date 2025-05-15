import { SkaarhojPanel } from '../skaarhoj-panel'
import { PanelConfiguration } from '../../../model/interfaces/panel-configuration'
import { EntityTestFactory } from '../../../model/test/entity-test-factory'
import { PanelCommandType, PanelModel, PanelType, SkaarhojModel } from '../../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../../model/exceptions/unsupported-operation-exception'
import { Logger } from '../../../logger/logger'
import { instance, mock } from '@typestrong/ts-mockito'
import { StatusMessageService } from '../../services/status-message-service'
import { ColorConverter } from '../../interfaces/color-converter'
import { TBarPanelCommand, PanelCommand } from '../../../model/interfaces/input-configuration'

class FakeSkaarhojPanel extends SkaarhojPanel {
  public callUpdateTBarCommandWithValues(command: TBarPanelCommand, value: number): PanelCommand {
    return this.updateTBarCommandWithValues(command, value)
  }
}
import { InvokedActionService } from '../../interfaces/invoked-action-service'

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
        expect(() => new SkaarhojPanel(panelConfiguration, instance(mock<InvokedActionService>()), instance(mock(StatusMessageService)), instance(mock<ColorConverter>()), logger, EntityTestFactory.createPanelLayoutConfiguration())).throws(UnsupportedOperationException)
      })
    })

    describe('it receives a PanelConfiguration that does not have a Skaarhoj model', () => {
      it('throws an unsupported operation exception', () => {
        panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: PanelType.SKAARHOJ, model: 'NON_SKAARHOJ_MODEL' as PanelModel })
        expect(() => new SkaarhojPanel(panelConfiguration, instance(mock<InvokedActionService>()), instance(mock(StatusMessageService)), instance(mock<ColorConverter>()), logger, EntityTestFactory.createPanelLayoutConfiguration())).throws(UnsupportedOperationException)
      })
    })

    describe('it receives a PanelConfiguration with Skaarhoj type and model', () => {
      it('does not throw any exception', () => {
        panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: PanelType.SKAARHOJ, model: SkaarhojModel.MK48 })
        expect(() => {
          new SkaarhojPanel(panelConfiguration, instance(mock<InvokedActionService>()), instance(mock(StatusMessageService)), instance(mock<ColorConverter>()), logger, EntityTestFactory.createPanelLayoutConfiguration())
        }).not.throws()
      })
    })
  })

  describe('SkaarhojPanel receives T-bar value 0 then 1000', () => {
    it('throws a TBarValueSpikeException', () => {
      panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: PanelType.SKAARHOJ, model: SkaarhojModel.MKT1A })
      const panel = new FakeSkaarhojPanel(panelConfiguration, instance(mock<InvokedActionService>()), instance(mock(StatusMessageService)), instance(mock<ColorConverter>()), logger, EntityTestFactory.createPanelLayoutConfiguration())
      expect(() => {
        panel.callUpdateTBarCommandWithValues({ type: PanelCommandType.T_BAR, shouldExecuteTake: false, value: 0 }, 0)
        panel.callUpdateTBarCommandWithValues({ type: PanelCommandType.T_BAR, shouldExecuteTake: false, value: 0 }, 1000)
      }).throws()
    })
  })

  describe('SkaarhojPanel receives T-bar value 1000 then 0', () => {
    it('throws a TBarValueSpikeException', () => {
      panelConfiguration = EntityTestFactory.createPanelConfiguration({ type: PanelType.SKAARHOJ, model: SkaarhojModel.MKT1A })
      const panel = new FakeSkaarhojPanel(panelConfiguration, instance(mock<InvokedActionService>()), instance(mock(StatusMessageService)), instance(mock<ColorConverter>()), logger, EntityTestFactory.createPanelLayoutConfiguration())
      expect(() => {
        panel.callUpdateTBarCommandWithValues({ type: PanelCommandType.T_BAR, shouldExecuteTake: false, value: 0 }, 1000)
        panel.callUpdateTBarCommandWithValues({ type: PanelCommandType.T_BAR, shouldExecuteTake: false, value: 0 }, 0)
      }).throws()
    })
  })
})
