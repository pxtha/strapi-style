'use strict';
const stripe = require('stripe')('sk_test_51OWCdNKX1zdpXEzPjctv1zFoI53arBFUtiAterxqQVwJyEYXbq2GjfgNZTLmDqPh2oo8lklLVCAEAKBenqZPWS9000b7xFr7rl');

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// Origin
module.exports = createCoreController('api::order.order')

// Custom
module.exports = createCoreController('api::order.order', ({strapi }) => ({
  async create(ctx) {
    
    const { id } = ctx.state.user; //ctx.state.user contains the current authenticated user
    const { req } = ctx.request.body;
    // todo:
    // create odrer
    // order has many order-item:
    // oder item has qty, product variant id
    try {
      const lineItems = await Promise.all(
        req.products.map( async (cart) => {
          const item = await strapi
            .service("api::product.product")
            .findOne(cart.id)
          
          console.log(item, "item")
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.product_name,
              },
              unit_amount:  Math.round(item.sale_price ? item.sale_price * 100 : item.price * 100),
            },
            quantity: cart.qty,
          }
        })
      )

      console.log(lineItems)
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `http://192.168.52.102:3000?success=true`,
        cancel_url: `http://192.168.52.102:3000?success=false`,
      });

      console.log("here", session)

      const order = await strapi
        .service("api::order.order")
        .create({ data:{
            user_id: id,
            stripe_id: session.id,
            shipping_information_id: req.shipping_information_id || null,
            billing_information_id: req.billing_information_id || null,
            status: 'OrderCreated',
            total_amount: session.amount_total,
            description: req.description,
          }});

      console.log(order)
      await Promise.all(
        req.products.map( async (orderItem) => {
            await strapi
            .service("api::order-item.order-item")
            .create({ data:{
                order_id: order.id,
                quantity: orderItem.qty,
                product: orderItem.id,
                product_variant: orderItem.product_variant_id,
                size: orderItem.size_id
              }});
        })
      )

      return {stripeSession: session};

    } catch (err) {
      console.log(err)
      ctx.badRequest([{messages: [{id: 'Stripe.error'}]}]);
      return { err };
    }
  },

}))
