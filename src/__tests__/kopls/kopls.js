import Matrix from 'ml-matrix';
import Kernel from 'ml-kernel';
import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { KOPLS } from '../../index';

expect.extend({ toBeDeepCloseTo });

describe.skip('K-OPLS', () => {
  var Xtest = new Matrix(require('../../../data/Xtest.json'));
  var Xtrain = new Matrix(require('../../../data/Xtrain.json'));
  var Ytest = require('../../../data/Ytest.json');
  var Ytrain = new Matrix(require('../../../data/Ytrain.json'));
  var Tp = new Matrix(require('../../../data/tp.json'));
  var to = new Matrix(require('../../../data/to.json'));

  var kernel = new Kernel('gaussian', {
    sigma: 25
  });

  var cls = new KOPLS({
    orthogonalComponents: 10,
    predictiveComponents: 1,
    kernel: kernel
  });

  cls.train(Xtrain, Ytrain);

  it('K-OPLS test with main features', () => {
    var {
      prediction,
      predScoreMat,
      predYOrthVectors
    } = cls.predict(Xtest);

    for (var i = 0; i < predScoreMat.length; ++i) {
      for (var j = 0; j < predScoreMat[i].length; ++j) {
        expect(predScoreMat[i][j][0]).toBeCloseTo(Tp[i][j], 2);
      }
    }

    for (i = 0; i < predYOrthVectors.length; ++i) {
      for (j = 0; j < predYOrthVectors[i].length; ++j) {
        expect(predYOrthVectors[i][j][0]).toBeCloseTo(to[i][j], 2);
      }
    }

    expect(prediction.to2DArray()).toBeDeepCloseTo(Ytest, 3);
  });

  it('Load and save', () => {
    var model = KOPLS.load(JSON.parse(JSON.stringify(cls)), kernel);
    var output = model.predict(Xtest).prediction;

    expect(output.to2DArray()).toBeDeepCloseTo(Ytest, 3);
  });

  it('Test with real dataset', () => {
    var Xtest = new Matrix(require('../../../data/Xtest1.json'));
    var Xtrain = new Matrix(require('../../../data/Xtrain1.json'));
    var Ytest = require('../../../data/Ytest1.json');
    var Ytrain = new Matrix(require('../../../data/Ytrain1.json'));

    var cls = new KOPLS({
      orthogonalComponents: 10,
      predictiveComponents: 2,
      kernel: kernel
    });

    cls.train(Xtrain, Ytrain);
    var output = cls.predict(Xtest).prediction;
    expect(output.to2DArray()).toBeDeepCloseTo(Ytest, 1);
  });
});