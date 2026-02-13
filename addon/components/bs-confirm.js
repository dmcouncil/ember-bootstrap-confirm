import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

// Despite being re-written for Ember 5, this component cannot take advantage of the newest 'Glimmer' framework,
// due to the usage of `didInsertElement` and `willDestroyElement` (which is not allowed in the new framework).
export default Component.extend({
  classNames: ['bs-confirm', 'modal', 'modal-warning'],
  attributeBindings: ['tabindex'],
  tabindex: -1,
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
    window.confirm = this.oldConfirm;
  },

  // Actions

  openDialog: action(function(message, callback, options) {
    this.set('message', message);
    this.set('yesCallback', callback);

    this._processOptions(options || {});
    this._resetUI();

    $(this.element).modal({
      backdrop: 'static'
    });
  }),

  yes: action(function() {
    if (this.typeToConfirmText) {
      if (this.typeToConfirmValue.toUpperCase() !== this.typeToConfirmText.toUpperCase()) {
        $(this.element).find('.type-to-confirm').addClass('has-error');
        return;
      }
    }

    let yesCallback = this.yesCallback;
    if (yesCallback) {
      $(this.element).modal('hide');
      return yesCallback();
    }
  }),

  no: action(function() {
    if (this.noCallback) {
      this.noCallback();
    }
    $(this.element).modal('hide');
  }),

  // Properties

  htmlSafeTitle: computed('title', function() {
    return htmlSafe(this.title);
  }),

  htmlSafeMessage: computed('message', function() {
    return htmlSafe(this.message);
  }),

  // Helpers

  _replacementConfirmation() {
    return (message, callback, options) => {
      this.send('openDialog', message, callback, options);
    };
  },

  _processOptions(options) {
    this.set('title', options.title || 'Please confirm');
    this.set('isWarningTitle', options.isWarningTitle || false);  // isWarningTitle adds an exclamation icon to the title and makes it orange
    this.set('yesActionText', options.yesActionText || 'OK');
    this.set('noActionText', options.noActionText || 'Cancel');
    this.set('noCallback', options.noCallback || null);
    this.set('yesButtonOnly', options.yesButtonOnly || false);
    this.set('dialogClasses', options.dialogClasses || null);
    this.set('typeToConfirmText', options.typeToConfirmText || null);
  },

  // This confirm box sticks around forever in a hidden state, so every time we open it we have to clean the UI
  _resetUI() {
    this.set('typeToConfirmValue', '');
    $(this.element).find('.type-to-confirm').removeClass('has-error');
  }
});
