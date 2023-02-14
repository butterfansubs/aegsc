class AssDefaults {
  static BASE_DEFAULTS = {
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
  };

  constructor() {
    this.defaults = Object.assign({}, AssDefaults.BASE_DEFAULTS);
  }

  setDefaults(defaults) {
    this.defaults = Object.assign({}, this.defaults, defaults);
  }

  supplyDefaults(assObject) {
    return Object.assign({}, this.defaults, assObject);
  }
}


module.exports = {
  AssDefaults,
};
