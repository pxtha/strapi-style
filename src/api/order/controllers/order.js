'use strict';
const stripe = require('stripe')('sk_test_51OWCdNKX1zdpXEzPjctv1zFoI53arBFUtiAterxqQVwJyEYXbq2GjfgNZTLmDqPh2oo8lklLVCAEAKBenqZPWS9000b7xFr7rl');

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi }) => ({
  async create(ctx) {
    const {id} = ctx.state.user; //ctx.state.user contains the current authenticated user
    const {products} = ctx.request.body;
    try {
      const lineItems = await Promise.all(
        products.map( async (product) => {
          const item = await strapi
            .service("api::product.product")
            .findOne(product.product)
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.product_name,
              },
              unit_amount:  Math.round(item.price * 100),
            },
            quantity: product.amount,
          }
        })
      )

      console.log(lineItems)
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `http://localhost:3000?success=true`,
        cancel_url: `http://localhost:3000?success=false`,
      });

      console.log("here", session)

      const order = await strapi
        .service("api::order.order")
        .create({ data:{
            user_id: id,
            stripe_id: session.id,
            shipping_information_id: 1,
            status: 'OrderCreated',
          }});

      console.log(order)
      await Promise.all(
        products.map( async (orderItem) => {
            await strapi
            .service("api::order-item.order-item")
            .create({ data:{
                order_id: order.id,
                quantity: orderItem.amount,
                product: orderItem.product,
              }});
        })
      )

      return {stripeSession: session};

    } catch (err) {
      console.log(err)
      ctx.badRequest(null, [{messages: [{id: 'Stripe.error'}]}]);
      return { err };
    }
  }
}))