'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.service("plugin::graphql.extension");
    extensionService.use(({ strapi }) => ({
      typeDefs: `
       type ProductSingle {
        single: ProductEntityResponse
        prev: ProductEntityResponse
        next: ProductEntityResponse
        related: [ProductEntityResponse]
       }
       type Query {
        productOne(id: Int!, onlyData: Boolean): ProductSingle
       }
      `,

      resolvers: {
        Query: {
          productOne: {
            resolve: async (parent, args, context) => {
              const {toEntityResponse} = strapi.service(
                "plugin::graphql.format"
              ).returnTypes;

              const product = await strapi.services["api::product.product"].findOne(args.id)
              if (args.onlyData) {
                return {single: toEntityResponse(product)};
              } else {
                const listProducts = await strapi.services["api::product.product"].find({
                  filters: {categories: {in: product.categories}},
                });
                const relatedProducts = listProducts.results
                console.log(relatedProducts)
                const index = relatedProducts.findIndex(item => item.id === product.id);
                console.log(index)
                return {
                  single: toEntityResponse(product),
                  prev: index > 0 ? toEntityResponse(relatedProducts[index - 1]) : null,
                  next: index < relatedProducts.length - 1 ? toEntityResponse(relatedProducts[index + 1]) : null,
                  related: relatedProducts.filter(item => item.id !== product.id).slice(0, 5).map(item => toEntityResponse(item))
                };
              }

            }
          },
        },
      },
      resolversConfig: {
        "Query.productOne": {
          auth: false,
        },
      },
    }));
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
