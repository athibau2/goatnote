import { SendEmailCommand, SendBulkTemplatedEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { 
    buildHtml,
    getSubject
} from './email-builders.js';

const REGION = 'us-east-2';
const smClient = new SecretsManagerClient({
  region: REGION,
    credentials: {
        accessKeyId: process.env.NUXT_ENV_SECRET_READER_KEY_ID,
        secretAccessKey: process.env.NUXT_ENV_SECRET_READER_SECRET_KEY,
    }
});

/**
 * Fetches the SES credentials from AWS Secrets Manager.
 * @returns {Promise<{accessKeyId: string, secretAccessKey: string}>}
 */
async function getSesCredentials() {
  const secretName = process.env.NUXT_ENV_SES_SECRET_NAME;
  
  try {
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });
    
    const data = await smClient.send(command);

    if (data.SecretString) {
      // The secret is stored as a JSON string
      const secret = JSON.parse(data.SecretString);

      return {
        accessKeyId: secret.SES_ACCESS_KEY_ID,
        secretAccessKey: secret.SES_ACCESS_KEY_SECRET,
      };
    }
    
    throw new Error("SecretString was empty or null.");
    
  } catch (err) {
    console.error(`Error retrieving SES credentials from ${secretName}:`, err);
    throw new Error("Security Error: Failed to load SES credentials securely.");
  }
}

export async function handler(event, context) {
  const payload = JSON.parse(event.body);
  const headers = event.headers;

  const credentials = await getSesCredentials();

  const sesClient = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey
    }
  });

  let fromAddress = "GOAT Notes <no-reply@deltaapps.dev>";
  let isMass = (headers.type == 'admin-email');
  let command;

  if (isMass) {
    const templateData = JSON.stringify({
      SUBJECT: payload.subject,
      BODY: payload.body,
      S3_BUCKET_URL: process.env.NUXT_ENV_AWS_S3_BUCKET
    });

    const destinations = payload.emails.map(email => ({
      Destination: { ToAddresses: [email] }, // Every recipient is individually listed
      ReplacementTemplateData: templateData,  // All recipients get the same content
    }));

    command = new SendBulkTemplatedEmailCommand({
      Source: fromAddress,
      Template: 'MASS_EMAIL_GN',
      Destinations: destinations,
      ConfigurationSetName: 'my-first-configuration-set',
      DefaultTemplateData: templateData, 
    });
  } else {
    const createSendEmailCommand = (toAddresses, fromAddress) => {
      return new SendEmailCommand({
        ConfigurationSetName: 'my-first-configuration-set',
        Tags: [{
          Name: 'Batch-ID',
          Value: `Single-Send-${Date.now()}`
        }],
        Destination: {
          ToAddresses: toAddresses,
          CcAddresses: [],
          BccAddresses: []
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: buildHtml(headers, payload),
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: getSubject(headers.type, payload),
          },
        },
        Source: fromAddress,
      });
    };

    // For single sends, we assume only the first email in the array is the recipient
    command = createSendEmailCommand(
      [payload.emails[0]], 
      fromAddress
    );
  }

  try {
      await sesClient.send(command);
      return { statusCode: 200, body: JSON.stringify({ message: "Email sent successfully." }) };
  } catch (e) {
      console.error("Failed to send email.", e);
      return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}