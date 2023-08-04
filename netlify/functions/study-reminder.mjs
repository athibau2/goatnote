// ./netlify/functions/study-reminder.js
const { createClient } = require('@supabase/supabase-js');
import fetch from 'node-fetch';

exports.handler = async function(event, context) {
    // Init database connection
    const supabaseUrl = process.env.NUXT_ENV_SUPABASE_URL;
    const supabaseKey = process.env.NUXT_ENV_SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error, status } = await supabase.from('get_daily_plans')
        .select()
    if (!error) {
        data.forEach(async element => {
            const body= {
                'firstname': element.firstname,
                'email': element.email,
                'studydate': element.studydate,
                'notenames': element.notenames,
                'times': element.times,
                'subject': 'Study Plan Reminder',
            }
            await fetch(process.env.NUXT_ENV_EMAIL_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Type': 'reminder-email'
                },
                body: JSON.stringify(body)
            })
        });
        return { statusCode: 200 }
    } else if (error) {
        console.log(error)
        return { statusCode: status }
    }
}