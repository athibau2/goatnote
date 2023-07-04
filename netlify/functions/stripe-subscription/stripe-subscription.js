// ./netlify/functions/stripe-webhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const payload = JSON.parse(event.body);
  const sigHeader = event.headers['stripe-signature'];

  console.log('in webhook!')

  let eventStripe;

  try {
    eventStripe = stripe.webhooks.constructEvent(payload, sigHeader, process.env.NUXT_ENV_STRIPE_WEBHOOK_SIGNING_SECRET);
    console.log(eventStripe)
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }


  // Handle the event
  switch (eventStripe.type) {
    case 'checkout.session.completed':
      const session = eventStripe.data.object;

      console.log('completed')

      // Here you should update your database
      const supabaseUrl = process.env.NUXT_ENV_SUPABASE_URL;
      const supabaseKey = process.env.NUXT_ENV_SUPABASE_URL;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Assuming you have a 'users' table and the 'id' of the user is stored in 'client_reference_id'
      const { data, error } = await supabase
        .from('users')
        .update({ subscription_status: 'active' })
        .eq('id', session.client_reference_id);

      if (error) {
        return {
          statusCode: 500,
          body: `Supabase Error: ${error.message}`,
        };
      }

      break;
    case 'customer.subscription.created':
      console.log('created')
      break;    
    case 'customer.subscription.updated':
      console.log('updated')
      break;    
    case 'customer.subscription.deleted':
      console.log('deleted')
      break;    
    default:
      // Unexpected event type
      return { statusCode: 400 };
  }

  // Return a response to acknowledge receipt of the event
  return { statusCode: 200 };
};
