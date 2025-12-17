const AWS_S3_BUCKET_URL = process.env.NUXT_ENV_AWS_S3_BUCKET;

export function buildHtml(headers, payload) {
  switch(headers.type) {
      case 'welcome-email':
          return buildWelcomeEmail(payload.name)
      case 'magic-link':
          return buildRecoveryEmail(payload.name, payload.link)
      case 'delete-email':
          return buildDeleteEmail(payload.name)
  }
}

export function getSubject(headerType, payload) {
  switch(headerType) {
      case 'welcome-email':
          return `Welcome, ${payload.name}!`
      case 'magic-link':
          return 'Account Recovery'
      case 'delete-email':
          return 'Account Deletion Confirmation'
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
              <img class="logo" src="${AWS_S3_BUCKET_URL}/GN.png" />
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
              <img class="logo" src="${AWS_S3_BUCKET_URL}/GN.png" />
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
              <img class="logo" src="${AWS_S3_BUCKET_URL}/GN.png" />
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