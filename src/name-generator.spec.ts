import { NameGenerator } from './name-generator'

describe(NameGenerator.constructor.name, () => {
  describe('getName', () => {
    it('returns "Sofie TV 2 server"', () => {
      const nameGenerator: NameGenerator = new NameGenerator()

      const result: string = nameGenerator.getName()

      expect(result).toBe('Sofie TV 2 server')
    })
  })
})
