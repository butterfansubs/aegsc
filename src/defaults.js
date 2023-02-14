class AssDefaults {
  supplyDefaults(assObject) {
    return Object.assign({
      type: 'Comment',
      layer: '0',
      startTime: '0:00:00.00',
      endTime: '0:00:00.00',
      style: 'Default',
      actor: '',
      marginL: '0',
      marginR: '0',
      marginV: '0',
      effect: '',
      text: '',
    }, assObject);
  }
}


module.exports = {
  AssDefaults,
};
