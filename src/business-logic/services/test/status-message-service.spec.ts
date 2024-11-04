import { StatusMessageService } from '../status-message-service'
import { StatusMessageRepository } from '../../../data-access/interfaces/status-message-repository'
import { StatusMessageEmitter } from '../../interfaces/status-message-emitter'
import { HttpService } from '../../interfaces/http-service'
import { anyString, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { EntityTestFactory } from '../../../model/test/entity-test-factory'
import { StatusMessage } from '../../../model/entities/status-message'

describe(StatusMessageService.name, () => {
  describe(StatusMessageService.prototype.getStatusMessages.name, () => {
    it('returns statusMessages both from internally and from Alba', async() => {
      const albaStatusMessages: StatusMessage[] = [
        EntityTestFactory.createStatusMessage({ id: 'alba1' }),
        EntityTestFactory.createStatusMessage({ id: 'alba2' })
      ]

      const httpService: HttpService = mock<HttpService>()
      when(httpService.get(anyString())).thenResolve(albaStatusMessages)

      const internalStatusMessages: StatusMessage[] = [
        EntityTestFactory.createStatusMessage({ id: 'internal1' }),
        EntityTestFactory.createStatusMessage({ id: 'internal2' })
      ]
      const statusMessageRepository: StatusMessageRepository = mock<StatusMessageRepository>()
      when(statusMessageRepository.getStatusMessages()).thenReturn(internalStatusMessages)

      const testee: StatusMessageService = createTestee({ httpService, statusMessageRepository })

      const result: StatusMessage[] = await testee.getStatusMessages()
      expect(result).toHaveLength(4)
      albaStatusMessages.concat(internalStatusMessages).forEach((statusMessage) => {
        expect(result).includes(statusMessage)
      })
    })
  })

  describe(StatusMessageService.prototype.sendStatusMessage.name, () => {
    it('emits a StatusMessage event', () => {
      const statusMessage: StatusMessage = EntityTestFactory.createStatusMessage()
      const statusMessageEventEmitter: StatusMessageEmitter = mock<StatusMessageEmitter>()

      const testee: StatusMessageService = createTestee({ statusMessageEventEmitter })
      testee.sendStatusMessage(statusMessage)

      verify(statusMessageEventEmitter.emitStatusMessage(statusMessage)).once()
    })

    it('updates the StatusMessage', () => {
      const statusMessage: StatusMessage = EntityTestFactory.createStatusMessage()
      const statusMessageRepository: StatusMessageRepository = mock<StatusMessageRepository>()

      const testee: StatusMessageService = createTestee({ statusMessageRepository })
      testee.sendStatusMessage(statusMessage)

      verify(statusMessageRepository.updateStatusMessage(statusMessage)).once()
    })
  })
})

function createTestee(params?: {
  statusMessageRepository?: StatusMessageRepository
  statusMessageEventEmitter?: StatusMessageEmitter
  httpService?: HttpService
}): StatusMessageService {
  return new StatusMessageService(
    instance(params?.statusMessageRepository ?? mock<StatusMessageRepository>()),
    instance(params?.statusMessageEventEmitter ?? mock<StatusMessageEmitter>()),
    instance(params?.httpService ?? mock<HttpService>())
  )
}
