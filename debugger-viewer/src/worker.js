import lunr from 'lunr';

	this.idx = null;

	export function add(a, b) {
		// block for half a second to demonstrate asynchronicity
		let start = Date.now();
		while (Date.now()-start < 500);
		return a + b;
	}

	export function index(events) {
		this.idx = lunr(function () {
		  this.ref('id');
		  this.field('type');
			this.field('receivedAt');

		  events.forEach(function (event) {
		    this.add(event);
		  }, this);
		});
	}

	export function search(input) {
		return this.idx && this.idx.search(input);
	}
