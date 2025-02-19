module.exports = {
  async up(db: any): Promise<void> {
    await db.collection('panelConfigurations').updateMany({}, { $set: { isDisabled: false } })
  },

  async down(db: any): Promise<void> {
    await db.collection('panelConfigurations').updateMany({}, { $unset: { isDisabled: '' } })
  }
}
