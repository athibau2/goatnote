import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

export async function handler(event, context) {
  const payload = JSON.parse(event.body);
  const headers = event.headers;
  const REGION = 'us-east-2';
  const sesClient = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.NUXT_ENV_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.NUXT_ENV_SES_SECRET_ACCESS_KEY
    }
  });

  let subject = ''
  let isMass = (headers.type == 'admin-email')

  function buildHtml() {
    switch(headers.type) {
        case 'welcome-email':
            subject = `Welcome, ${payload.name}!`
            return buildWelcomeEmail(payload.name)
        case 'magic-link':
            subject = 'Account Recovery'
            return buildRecoveryEmail(payload.name, payload.link)
        case 'admin-email':
            subject = payload.subject
            return buildAdminEmail(payload.body)
        case 'delete-email':
            subject = 'Account Deletion Confirmation'
            return buildDeleteEmail(payload.name)
    }
  }

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

  function buildDeleteEmail(name) {
    const deleteMessage = `Dear ${name},<br><br>You have requested to delete your GOAT Notes account, and that process has successfully been completed. We will sure miss you, and we hope you come back soon!<br><br>Best regards,<br>Delta Apps, LLC`;

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
              <h1>Account Deletion Successful</h1>
              <p>${deleteMessage}</p>
              <span>
                Until you sign up again, you will no longer receive emails from us.
              </span>
            </center>
          </div>
        </body>
      </html>
    `;
  
    return emailTemplate;
  }
  
  function buildRecoveryEmail(name, link) {
    const recoveryMessage = `Dear ${name},<br><br>We have received a request to recover your account. Follow the link below to be logged back in to your account. If you did not submit this request, please disregard this email.<br><br>Best regards,<br>Delta Apps, LLC`;
    
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
              <h1>Account Recovery Request</h1>
              <p>${recoveryMessage}</p>
              <a href="${link}">
                Go to Account
              </a>
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

  const createSendEmailCommand = (toAddresses, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: isMass ? ['no-reply@deltaapps.dev'] : toAddresses,
        BccAddresses: isMass ? [...toAddresses] : []
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: buildHtml(),
          },
        //   Text: {
        //     Charset: "UTF-8",
        //     Data: "TEXT_FORMAT_BODY",
        //   },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

  try {
    const sendEmailCommand = createSendEmailCommand(
        payload.emails,
        "GOAT Notes <no-reply@deltaapps.dev>",
    );
    await sesClient.send(sendEmailCommand);
    return { statusCode: 200 };
  } catch (e) {
    console.error("Failed to send email.", e);
    return { statusCode: 500 };
  }
}

