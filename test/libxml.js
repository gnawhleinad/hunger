var assert = require('assert');

var libxml = require('libxmljs');
var fs = require('fs');

var api = './api.xsd';

describe('libxmljs', function(){
	var bacon = '<?xml version="1.0" encoding="UTF-8"?>' +
		    '<hungerapi>' +
		        '<pork>' +
			    '<id>1</id>' +
			    '<type>bacon</type>' +
			    '<deliciousness>9000</deliciousness>' +
		        '</pork>' +
		    '</hungerapi>';

	describe(':schema', function() {
		describe('#exists', function(){
			it('should open without error', function(done){
				fs.open(api, 'r', function(err, fd){
					if (err) throw err;
					done();
				});
			});
		});
		
		describe('#read', function(){
			it('should read without error', function(){
				assert.doesNotThrow(function(){
					libxml.parseXml(fs.readFileSync(api).toString())
				});
			});
		});

		var xsd = libxml.parseXml(fs.readFileSync(api).toString());

		describe('#validate', function(){
			it('should validate without error', function(){
				var xml = libxml.parseXml(bacon);
				assert.equal(xml.validate(xsd), true);
				assert.equal(xml.validationErrors.length, 0);
			});
		});

		describe('#invalidate', function(){
			it('should invalidate without error', function(){
				var s = '<?xml version="1.0" encoding="UTF-8"?>' +
					'<hungerapi>' +
					    '<pork>' +
					        '<id>1</id>' +
						'<type>bacon</type>' +
						'<deliciousness>nasty</deliciousness>' + // heretic.
					    '</pork>' +
					'</hungerapi>';
				var xml = libxml.parseXml(s);
				assert.equal(xml.validate(xsd), false);
				assert.equal(xml.validationErrors.length, 1);
			});
		});
	});

	describe(':xml', function(){
		var xml = new libxml.Document();

		describe('#build', function(){
			it('should build without error', function(){
				xml.node('hungerapi')
					.node('pork')
						.node('id', '1').parent()
						.node('type', 'bacon').parent()
						.node('deliciousness', '9000');
			});
			it('should match "bacon" without error', function(){
				assert.equal(xml.toString(), libxml.parseXml(bacon).toString());
			});
		});

		describe('#validate', function(){
			it('should validate without error', function(){
				var xsd = libxml.parseXml(fs.readFileSync(api).toString());
				assert.equal(xml.validate(xsd), true);
				assert.equal(xml.validationErrors.length, 0);
			});
		});
	});
});
