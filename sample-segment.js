var Analytics = require('analytics-node');
var analytics = new Analytics('JIWg9nqSZVjEqg2tctimi3QwumRHqP1F');

analytics.identify({
  userId:'f4ca124298',
  traits: {
    name: 'Michael Bolton',
    email: 'mbolton@initech.com',
    createdAt: new Date('2014-06-14T02:00:19.467Z')
  }
});

analytics.page({
  userId: '019mr8mf4r',
  category: 'Docs',
  name: 'Node.js Library',
  properties: {
    url: 'https://segment.com/docs/libraries/node',
    path: '/docs/libraries/node/',
    title: 'Node.js Library - Segment',
    referrer: 'https://github.com/segmentio/analytics-node'
  }
});

analytics.track({
  userId:'f4ca124298',
  event: 'Signed Up',
  properties: {
    plan: 'Enterprise'
  }
});

analytics.track({
  userId:'f4ca124298',
  event: 'Bookmarked Article',
  properties: {
    title: 'Snow Fall',
    subtitle: 'The Avalanche at Tunnel Creek',
    author: 'John Branch'
  }
});
