'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _transclude = require('./transclude');

var _writers = require('../../writers');

var _utilTests = require('../../util/tests');

describe('@Transclude Component decorator', function () {
	it('should add the transclude key on the DDO', function () {
		var MyClass = (function () {
			function MyClass() {
				_classCallCheck(this, _MyClass);
			}

			var _MyClass = MyClass;
			MyClass = (0, _transclude.Transclude)(MyClass) || MyClass;
			return MyClass;
		})();

		_writers.componentWriter.has('transclude', MyClass).should.be.ok;
		_writers.componentWriter.get('transclude', MyClass).should.be.ok;
	});

	it('should let you pass a string or boolean value to the decorator', function () {
		var First = (function () {
			function First() {
				_classCallCheck(this, _First);
			}

			var _First = First;
			First = (0, _transclude.Transclude)(true)(First) || First;
			return First;
		})();

		var Second = (function () {
			function Second() {
				_classCallCheck(this, _Second);
			}

			var _Second = Second;
			Second = (0, _transclude.Transclude)('element')(Second) || Second;
			return Second;
		})();

		_writers.componentWriter.get('transclude', First).should.be.ok;
		_writers.componentWriter.get('transclude', Second).should.eql('element');
	});
});