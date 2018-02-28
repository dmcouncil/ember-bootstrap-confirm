import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('bs-confirm', 'Integration | Component | bs confirm', {
  integration: true
});

test('it renders when confirm is called', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bs-confirm}}`);

  Ember.run(function() {
    window.confirm("Do you want to continue?");
  });

  assert.equal($('.modal-body').text().trim(), 'Do you want to continue?', 'Dialog is displayed');
});


test('clicking cancel closes the dialog', function(assert) {

  this.render(hbs`{{bs-confirm}}`);

  Ember.run(function() {
    window.confirm("Do you want to continue?");
  });

  this.$('.btn-default').click();

  assert.equal(this.$('.modal').is(':visible'), false, 'modal dialog is closed');
});

test('clicking ok closes the dialog', function(assert) {
  this.render(hbs`{{bs-confirm}}`);

  Ember.run(function() {
    window.confirm("Do you want to continue?", function() {
      return true;
    });
  });

  this.$('.btn-primary').click();

  assert.equal(this.$('.modal').is(':visible'), false, 'modal dialog is closed');
});

test('clicking ok runs the yes-callback', function(assert) {
  assert.expect(1);

  this.render(hbs`{{bs-confirm}}`);

  Ember.run(function() {
    window.confirm("Do you want to continue?", function() {
      assert.ok('This is run when ok clicked');
    });
  });

  this.$('.btn-primary').click();
});

test('clicking cancel does not run the yes-callback', function(assert) {
  assert.expect(0);

  this.render(hbs`{{bs-confirm}}`);

  Ember.run(function() {
    window.confirm("Do you want to continue?", function() {
      assert.ok('This is run when ok clicked');
    });
  });

  this.$('.btn-default').click();
});
