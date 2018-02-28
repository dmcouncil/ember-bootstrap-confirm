import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal', 'modal-warning'],
  noActionText: 'Cancel',
  yesActionText: 'Ok',
  title: 'Please confirm',

  didInsertElement() {
    this._super(...arguments);
    this.set('oldConfirm', window.confirm);
    window.confirm = this._replacementConfirmation();
  },

  willDestroyElement() {
    this._super(...arguments);
    window.confirm = this.get('oldConfirm');
  },

  _replacementConfirmation() {
    return (message, callback) => {
      this.send('openDialog', message, callback);
    };
  },

  actions: {
    openDialog: function(message, callback) {
      this.set('message', message);
      this.set('yesCallback', callback);

      this.$().modal({
        backdrop: 'static'
      });
    },

    yes: function() {
      let yesCallback = this.get('yesCallback');
      if ( yesCallback ) {
        this.$().modal('hide');
        return yesCallback();
      }
    },

    no: function() {
      this.$().modal('hide');
    }

  }

});
