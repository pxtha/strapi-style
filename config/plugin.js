const { apolloPrometheusPlugin } = require('strapi-prometheus')

module.exports = ({ env }) => ({
  //...
  
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        plugins: [apolloPrometheusPlugin], // add the plugin to get apollo metrics
        tracing: true, // this must be true to get some of the data needed to create the metrics
      },
    },
  },

  'strapi-prometheus': {
    enabled: true,
    config: {
      // add prefix to all the prometheus metrics names.
      prefix: '',
      // use full url instead of matched url
      // true  => path label: `/api/models/1`
      // false => path label: `/api/models/:id`
      fullURL: false,

      // include url query in the url label
      // true  => path label: `/api/models?limit=1`
      // false => path label: `/api/models`
      includeQuery: false,

      // metrics that will be enabled, by default they are all enabled.
      enabledMetrics: {
        koa: true, // koa metrics
        process: true, // metrics regarding the running process
        http: true, // http metrics like response time and size
        apollo: true, // metrics regarding graphql
      },

      // interval at which rate metrics are collected in ms
      interval: 10_000,

      // set custom/default labels to all the prometheus metrics
      customLabels: {
        name: "strapi-prometheus",
      },
    }
  }
});
