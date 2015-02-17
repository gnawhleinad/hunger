var libxml = require('libxmljs');
var assert = require('assert');

var api = './api.xsd';

function Pork(){
	this.id = '';
	this.type = '';
	this.deliciousness = '';
}

Pork.prototype.toXml = function(){
	var xml = new libxml.Document();
	xml.node('pork')
		.node('id', this.id).parent()
		.node('type', this.type).parent()
		.node('deliciousness', this.deliciousness);
	return xml;
};

Pork.prototype.fromXml = function(x, xsd){
	var xml = libxml.parseXml(x);
	if (typeof xsd !== 'undefined') {
		assert(xml.validate(xsd), true);
	}
	this.id = xml.get('/hungerapi/pork/id/text()');
	this.type = xml.get('/hungerapi/pork/type/text()');
	this.deliciousness = xml.get('/hungerapi/pork/deliciousness/text()');
};

exports = module.exports = Pork;
