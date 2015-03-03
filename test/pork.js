var assert = require('assert');

var Pork = require('../pork');
var libxml = require('libxmljs');
var fs = require('fs');

var api = './api.xsd';
var bekon = './bacon.xml';

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

	describe('#fromXml', function(){
		var x = '<?xml version="1.0" encoding="UTF-8"?>' +
			'<hungerapi>' +
			    '<pork>' +
				'<id>1</id>' +
				'<type>bacon</type>' +
				'<deliciousness>9000</deliciousness>' +
			    '</pork>' +
			'</hungerapi>';

		it('should serialize from xml without error', function(){
			var b = new Pork();
			b.fromXml(x);
			assert.equal(b.id, '1');
			assert.equal(b.type, 'bacon');
			assert.equal(b.deliciousness, '9000');
		});

		it('should serialize from xml with validation without error', function(){
			var xsd = libxml.parseXml(fs.readFileSync(api).toString());

			var b = new Pork();
			b.fromXml(x, xsd);
			assert.equal(b.id, '1');
			assert.equal(b.type, 'bacon');
			assert.equal(b.deliciousness, '9000');
		});

		var bf = fs.readFileSync(bekon).toString();

		it('should serialize from xml file without error', function(){
			var b = new Pork();
			b.fromXml(bf);
			assert.equal(b.id, '1');
			assert.equal(b.type, 'bacon');
			assert.equal(b.deliciousness, '9000');
		});

		it('should serialize from xml file without error', function(){
			var xsd = libxml.parseXml(fs.readFileSync(api).toString());

			var b = new Pork();
			b.fromXml(bf, xsd);
			assert.equal(b.id, '1');
			assert.equal(b.type, 'bacon');
			assert.equal(b.deliciousness, '9000');
		});
	});
});
