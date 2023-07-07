import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.NUXT_ENV_OPENAI_ORG_ID,
    apiKey: process.env.NUXT_ENV_OPENAI_API_KEY,
});

export async function openaiGenerateStudyTools({ input }) {
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `Parse the provided notes and identify relevant vocabulary words along with their definitions, and relevant study questions along with their answers. Return this information in the following structure: 
            { vocab: [{word: 'your word', definition: 'your definition'},...], questions: [{question: 'your question', answer: 'your answer'},...]}.
            Here are the notes: ${input}`}],
    });
    return JSON.parse(completion.data.choices[0].message.content) ?? null
}
