import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { click, fillIn, find, findAll, render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { run } from '@ember/runloop';

module('Integration | Component | bs-confirm', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders (no options)', async function(assert) {
    await render(hbs`<BsConfirm />`);

    run(() => {
      confirm('Hi there', () => {});
    });

    assert.strictEqual(find('.modal-title').textContent.trim(), 'Please confirm');
    assert.dom('.modal-title').doesNotHaveClass('title-warning', 'title is not a warning');
    assert.strictEqual(find('.modal-body').textContent.trim(), 'Hi there');
    assert.strictEqual(find('.btn-primary').textContent, 'OK');
    assert.strictEqual(find('.btn-default').textContent, 'Cancel');
    assert.dom('.modal-dialog').doesNotHaveClass('class1');
    assert.dom('.modal-dialog').doesNotHaveClass('class2');
    assert.strictEqual(findAll('.type-to-confirm').length, 0, 'there is no type-to-confirm form');
  });

  test('it renders (basic options)', async function(assert) {
    await render(hbs`<BsConfirm />`);

    run(() => {
      confirm('Hi there',
        () => {},
        {
          title: 'I am Janet<br>',
          yesActionText: 'Yay!',
          noActionText: 'Nay.',
          dialogClasses: 'class1 class2'
        });
    });

    assert.strictEqual(find('.modal-title').textContent.trim(), 'I am Janet');
    assert.dom('.modal-title').doesNotHaveClass('title-warning', 'title is not a warning');
    assert.strictEqual(find('.modal-body').textContent.trim(), 'Hi there');
    assert.strictEqual(find('.btn-primary').textContent, 'Yay!');
    assert.strictEqual(find('.btn-default').textContent, 'Nay.');
    assert.dom('.modal-dialog').hasClass('class1');
    assert.dom('.modal-dialog').hasClass('class2');
    assert.strictEqual(findAll('.type-to-confirm').length, 0, 'there is no type-to-confirm form');
  });

  test('it renders (warning title, cancel-only, type to confirm)', async function(assert) {
    assert.expect(8);

    await render(hbs`<BsConfirm />`);

    run(() => {
      confirm('Hi there',
        () => assert.ok(true, 'Yes is called'),
        {
          isWarningTitle: true,
          yesButtonOnly: true,
          typeToConfirmText: 'CLEAR'
        });
    });

    assert.strictEqual(find('.modal-title').textContent.trim(), 'Please confirm');
    assert.dom('.modal-title').hasClass('title-warning', 'title is a warning');
    assert.strictEqual(find('.modal-body').textContent.trim().replace(/\s+/g, ' '), 'Hi there Type CLEAR to confirm');
    assert.strictEqual(findAll('.btn-default').length, 0);
    assert.strictEqual(find('.btn-primary').textContent, 'OK');
    assert.strictEqual(findAll('.type-to-confirm').length, 1, 'there is a type-to-confirm form');

    await fillIn('#input-confirm', 'claire');
    await triggerEvent('#input-confirm', 'change');
    await click('.btn-primary');

    assert.dom('.type-to-confirm').hasClass('has-error', 'misspelled input word');

    await fillIn('#input-confirm', 'clear');
    await triggerEvent('#input-confirm', 'change');
    await click('.btn-primary');
  });

});
