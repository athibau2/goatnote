require('dotenv').config();
const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');
const resend = new Resend(process.env.NUXT_ENV_RESEND_API_KEY);
const CronJob = require('cron').CronJob

const supabaseUrl = process.env.NUXT_ENV_SUPABASE_URL;
const supabaseKey = process.env.NUXT_ENV_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const cron = new CronJob(
  `0 0 2 * * *`,
  async function() {
    const { data, error, status } = await supabase.from('get_daily_plans')
      .select()
    console.log(data, error, status)
    if (!error) {
      data.forEach(async element => {
        let sendHour = (parseInt(element.times[0].split(':')[0]) + 23) % 24;
        let sendMin = (parseInt(element.times[0].split(':')[1]))

        if (sendHour < 10) sendHour = `0${sendHour}`
        if (sendMin < 10) sendMin = `0${sendMin}`
        
        let fullDate = `${element.studydate.split('T')[0]}T${sendHour}:${sendMin}:30`
        
        const job = new CronJob(
          new Date(fullDate),
          async function() {
            try {
              const res = await resend.emails.send({
                from: 'GOAT Notes <management@deltaapps.dev>',
                to: element.email,
                subject: 'Study Plan Reminder',
                html: buildReminderEmail(element.firstname, element.notenames, element.times)
              });
              console.log(res)
            } catch (err) {
              console.log(err)
            }
          },
          null,
          true,
          'America/Denver'
        );
      });
    } else if (error) {
      console.log(error)
    }
  },
  null,
  true,
  'America/Denver'
);


function buildReminderEmail(firstname, notenames, times) {
    times.forEach((time, index, array) => {
      if (time.split(':')[0] == 12) array[index] = time + 'pm';
      else if (time.split(':')[0] > 12) array[index] = (time.split(':')[0] - 12) + time.slice(2) + 'pm';
      else if (time.split(':')[0] < 12) array[index] = time + 'am';
    });

    const reminderMessage = `Dear ${firstname},<br><br>You have study plans in place today for the following notes:<br>

    ${notenames.map((element, index) => {
      return `<br><strong>${element}</strong> &ndash; ${times[index]}`
    }).join('')}
    <br>Visit your study plans <a href="https://goatnotes.net/plans">here.</a>
    <br><br>Best regards,<br>Delta Apps, LLC`;
    
    // Add HTML styling to the email template
    const emailTemplate = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }

            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }

            .logo {
              display: block;
              width: 150px;
              margin: 0 auto;
            }

            h1 {
              text-align: center;
              color: #2F2B28;
              font-size: 24px;
              margin-top: 30px;
            }

            p {
              color: #666666;
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
            }

            a {
              color: #007bff;
              text-decoration: none;
            }

            span {
              display: block;
              text-align: center;
              margin-top: 20px;
              color: #999999;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <center>
              <img class="logo" src="${process.env.NUXT_ENV_AWS_S3_BUCKET}/GN.png" />
              <h1>Time to Study!</h1>
              <p>${reminderMessage}</p>
              <span>
                You can modify your email settings
                <a href="https://goatnotes.net/account">here.</a>
              </span>
            </center>
          </div>
        </body>
      </html>
    `;

    return emailTemplate;
}
