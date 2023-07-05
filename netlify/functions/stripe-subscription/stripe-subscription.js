// ./netlify/functions/stripe-webhook.js
const stripe = require('stripe')(process.env.NUXT_ENV_STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  // const payload = JSON.parse(event.body);
  const payload = event.body;
  const sigHeader = event.headers['stripe-signature'];

  let eventStripe;

  try {
    eventStripe = stripe.webhooks.constructEvent(payload, sigHeader, process.env.NUXT_ENV_STRIPE_WEBHOOK_SIGNING_SECRET);
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // TODO: FIGURE OUT WHAT EVENT TYPE CANCELLING DOES, HANDLE SWITCH CASE

  // Init database connection
  const supabaseUrl = process.env.NUXT_ENV_SUPABASE_URL;
  const supabaseKey = process.env.NUXT_ENV_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Handle the event
  switch (eventStripe.type) {
    case 'customer.subscription.created':
      async function setActive() {
        const session = eventStripe.data.object;
  
        // Get the customer object
        const customer = await stripe.customers.retrieve(session.customer);
  
        // Update user table subscriptionstatus field to active
        const { data, error, status } = await supabase.from('user')
          .update({ subscriptionstatus: 'active' })
          .eq('email', customer.email);
        
        if (error) {
          console.log(error)
          return {
            statusCode: 500,
            body: `Supabase Error: ${error.message}`,
          };
        }
      }
      await setActive()
      break;    
    // case 'customer.subscription.updated':
    //   console.log('updated')
    //   break;    
    case 'customer.subscription.deleted':
      console.log('deleted')
      async function setInactive() {
        const session = eventStripe.data.object;
  
        // Get the customer object
        const customer = await stripe.customers.retrieve(session.customer);
  
        // Update user table subscriptionstatus field to active
        const { data, error, status } = await supabase.from('user')
          .update({ subscriptionstatus: 'active' })
          .eq('email', customer.email);
        
        if (error) {
          console.log(error)
          return {
            statusCode: 500,
            body: `Supabase Error: ${error.message}`,
          };
        }
      }
      await setInactive()
      break;    
    default:
      // Unexpected event type
      return { statusCode: 400 };
  }

  // Return a response to acknowledge receipt of the event
  return { statusCode: 200 };
};
