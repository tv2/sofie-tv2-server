module.exports = {
  async up(db: any) {
    await db.collection('panelConfigurations').updateMany({}, { $set: { isDisabled: false } })
  },

  async down(db: any) {
    await db.collection('panelConfigurations').updateMany({}, { $unset: { isDisabled: '' } })
  }
}
