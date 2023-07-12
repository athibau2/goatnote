const { Resend } = require('resend');
const resend = new Resend(process.env.NUXT_ENV_RESEND_API_KEY);
const fs = require('fs')
const path = require('path');

/**
 * 
 * @param {object} event contains body and headers. Send 'Type' header to specify email type
 * @param {*} context included by default in Javascript handlers
 * @returns nothing yet
 */

exports.handler = async function(event, context) {
  const payload = JSON.parse(event.body);
  const headers = event.headers

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
  }

  function buildWelcomeEmail(name) {
    const welcomeMessage = `Dear ${name},<br><br>Welcome to our website! We are thrilled to have you on board. Enjoy exploring our services and let us know if you have any questions.<br><br>Best regards,<br>Delta Apps, LLC`;

    // Add HTML styling to the email template
    const emailTemplate = `
      <html>
        <head>
          <style>
            /* Add your CSS styles here */
          </style>
        </head>
        <body>
          <center>
            <img src="https://goatnotes.net/assets/logos/GN.png" />
            <h1>Welcome to GOAT Notes!</h1>
            <p>${welcomeMessage}</p>
          </center>
        </body>
      </html>
    `;
  
    return emailTemplate;
  }
  
  function buildResetEmail(name, code, codeExpiration) {
    const resetMessage = `Dear ${name},<br><br>We have received a request to reset your password. Please use the following code: <strong>${code}</strong>.<br><br>This code will expire on ${codeExpiration}. If you did not request a password reset, please disregard this email.<br><br>Best regards,<br>Delta Apps, LLC`;
  
    // Resolve the image file path
    const imagePath = path.resolve(__dirname, 'assets', 'GN.png');
    
    // Read and encode the welcome image as a data URL
    const welcomeImage = fs.readFileSync(imagePath, { encoding: 'base64' });
    const welcomeImageSrc = `data:image/png;base64,${welcomeImage}`;
    
    // Add HTML styling to the email template
    const emailTemplate = `
      <html>
        <head>
          <style>
            /* Add your CSS styles here */
          </style>
        </head>
        <body>
          <center>
            <img src="${welcomeImageSrc}" />
            <h1>Password Reset Request</h1>
            <p>${resetMessage}</p>
          </center>
        </body>
      </html>
    `;
  
    return emailTemplate;
  }  

  // Return a response to acknowledge receipt of the event
  return { statusCode: 200 };
};
