const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');
const resend = new Resend(process.env.NUXT_ENV_RESEND_API_KEY);
const fs = require('fs')
const path = require('path');
const CronJob = require('cron').CronJob

/**
 * 
 * @param {object} event contains body and headers. Send 'Type' header to specify email type
 * @param {*} context included by default in Javascript handlers
 * @returns nothing yet
 */

exports.handler = async function(event, context) {
  const payload = JSON.parse(event.body);
  const headers = event.headers
  const supabaseUrl = process.env.NUXT_ENV_SUPABASE_URL;
  const supabaseKey = process.env.NUXT_ENV_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  switch(headers.type) {
    case 'welcome-email':
      await resend.emails.send({
        from: 'andrew@deltaapps.dev',
        to: payload.email,
        subject: `Welcome, ${payload.name}!`,
        html: buildWelcomeEmail(payload.name),
      });
      break;
    case 'reset-pass':
      await resend.emails.send({
        from: 'andrew@deltaapps.dev',
        to: payload.email,
        subject: 'Password Reset',
        html: buildResetEmail(payload.name, payload.code, payload.codeexpiration),
      });
      break;
    case 'admin-email':
      await resend.emails.send({
        from: 'andrew@deltaapps.dev',
        to: payload.email,
        subject: payload.subject,
        html: buildAdminEmail(payload.body)
      });
      break;
    case 'reminder-email':
      const { data, error, status } = await supabase.from('get_daily_plans')
        .select()
      if (!error) {
        data.forEach(async element => {
          const sendHour = (parseInt(element.times[0].split(':')[0]) + 23) % 24;
          const sendMin = (parseInt(element.times[0].split(':')[1]))
          const job = new CronJob(
            `30 ${sendMin} ${sendHour} * * *`,
            async function() {
              try {
                const res = await resend.emails.send({
                  from: 'andrew@deltaapps.dev',
                  to: element.email,
                  subject: payload.subject,
                  html: buildReminderEmail(element.firstname, element.notenames, element.times)
                });
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
      break;
  }

  // TODO: FIGURE OUT EXTRA NETLIFY EMAIL FUNCTION

  function buildWelcomeEmail(name) {
    const welcomeMessage = `Dear ${name},<br><br>Welcome to our website! We are thrilled to have you on board. Enjoy exploring our services and let us know if you have any questions.<br><br>Best regards,<br>Delta Apps, LLC`;

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
              <h1>Welcome to GOAT Notes!</h1>
              <p>${welcomeMessage}</p>
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
  
  function buildResetEmail(name, code, codeExpiration) {
    const resetMessage = `Dear ${name},<br><br>We have received a request to reset your password. Please use the following code: <strong>${code}</strong>.<br><br>This code will expire on ${codeExpiration}. If you did not request a password reset, please disregard this email.<br><br>Best regards,<br>Delta Apps, LLC`;
    
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
              <h1>Password Reset Request</h1>
              <p>${resetMessage}</p>
            </center>
          </div>
        </body>
      </html>
    `;
  
    return emailTemplate;
  }

  function buildAdminEmail(body) {
    const adminMessage = `${body}<br><br>Best regards,<br>Delta Apps, LLC`;
    
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
              <h1>A Message From Yours Truly</h1>
              <p>${adminMessage}</p>
            </center>
          </div>
        </body>
      </html>
    `;
  
    return emailTemplate;
  }

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

  // Return a response to acknowledge receipt of the event
  return { statusCode: 200 };
};
