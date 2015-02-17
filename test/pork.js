var assert = require('assert');

var Pork = require('../pork');
var libxml = require('libxmljs');
var fs = require('fs');

var api = './api.xsd';

describe('Pork', function(){
	var bacon = new Pork();
	bacon.id = '1';
	bacon.type = 'bacon';
	bacon.deliciousness = '9000';

	describe('#toXml', function(){
		it('should serialize to xml without error', function (){
			bacon.toXml();
		});
	});

	describe('#validate', function(){
		it('should validate without error', function(){
			var xsd = libxml.parseXml(fs.readFileSync(api).toString());
			var hunger = new libxml.Document();
			hunger.node('hungerapi')
				.addChild(bacon.toXml().root());
			assert.equal(hunger.validate(xsd), true);
			assert.equal(hunger.validationErrors.length, 0);
		});
	});
});
