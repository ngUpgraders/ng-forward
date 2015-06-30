'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _writers = require('../../writers');

require('../../util/tests');

var _directive = require('./directive');

describe('@Directive Decorator', function () {
  it('should set the correct provider metadata', function () {
    var MyDirectiveCtrl = (function () {
      function MyDirectiveCtrl() {
        _classCallCheck(this, _MyDirectiveCtrl);
      }

      var _MyDirectiveCtrl = MyDirectiveCtrl;
      MyDirectiveCtrl = (0, _directive.Directive)({ selector: '[my-directive]' })(MyDirectiveCtrl) || MyDirectiveCtrl;
      return MyDirectiveCtrl;
    })();

    _writers.providerWriter.get('type', MyDirectiveCtrl).should.eql('directive');
    _writers.providerWriter.get('name', MyDirectiveCtrl).should.eql('myDirective');
  });

  it('should restrict the directive type', function () {
    var AttrCtrl = (function () {
      function AttrCtrl() {
        _classCallCheck(this, _AttrCtrl);
      }

      var _AttrCtrl = AttrCtrl;
      AttrCtrl = (0, _directive.Directive)({ selector: '[attr]' })(AttrCtrl) || AttrCtrl;
      return AttrCtrl;
    })();

    var ClassCtrl = (function () {
      function ClassCtrl() {
        _classCallCheck(this, _ClassCtrl);
      }

      var _ClassCtrl = ClassCtrl;
      ClassCtrl = (0, _directive.Directive)({ selector: '.class' })(ClassCtrl) || ClassCtrl;
      return ClassCtrl;
    })();

    _writers.componentWriter.get('restrict', AttrCtrl).should.eql('A');
    _writers.componentWriter.get('restrict', ClassCtrl).should.eql('C');
  });

  it('should set sensible defaults for attribute and class directives', function () {
    var DirCtrl = (function () {
      function DirCtrl() {
        _classCallCheck(this, _DirCtrl);
      }

      var _DirCtrl = DirCtrl;
      DirCtrl = (0, _directive.Directive)({ selector: '[my-directive]' })(DirCtrl) || DirCtrl;
      return DirCtrl;
    })();

    _writers.componentWriter.get('scope', DirCtrl).should.eql(false);
  });

  it('should throw an error if used with an element selector', function () {
    var decorate = function decorate() {
      var MyComponentCtrl = (function () {
        function MyComponentCtrl() {
          _classCallCheck(this, _MyComponentCtrl);
        }

        var _MyComponentCtrl = MyComponentCtrl;
        MyComponentCtrl = (0, _directive.Directive)({ selector: 'my-component' })(MyComponentCtrl) || MyComponentCtrl;
        return MyComponentCtrl;
      })();
    };

    decorate.should['throw'](Error);
  });
});