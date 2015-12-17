"use strict";

var App = {

	items: ['cordons bleus', 'Vin blanc', 'test', 'Poisson'],

	init: function init() {

		var template = require('views/list');
		var html = template({ items: App.items });

		$('body').append(html);

	}
};

module.exports = App;