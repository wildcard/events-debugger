import lunr from 'lunr';
import parseEventMessageData from './utils/parse-event-message-data';

	let idx = null;
	let events = [];

	export function index(eventsData) {
		if (!eventsData || !eventsData.length) {
			return events.length && events[0].id;
		}

		const eventDocs = eventsData.map(parseEventMessageData);
		events.unshift(...eventDocs);

		idx = lunr(function () {
		  this.field('type');
			this.field('receivedAt');
			this.field('dataText');

		  events.forEach(function (eventDoc) {
		    this.add(eventDoc);
		  }, this);
		});

		return events[0].id;
	}

	export function search(input) {
		return idx && idx.search(input).map(r => r.ref);
	}
