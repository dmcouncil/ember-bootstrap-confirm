import Application from 'dummy/app';
import config from 'dummy/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { loadTests } from 'ember-qunit/test-loader';
import { start, setupEmberOnerrorValidation } from 'ember-qunit';

const app = Application.create(config.APP);
app.injectTestHelpers();  // this makes all imported homemade helpers available to all tests
setApplication(app);

setup(QUnit.assert);
setupEmberOnerrorValidation();
loadTests();
start();
