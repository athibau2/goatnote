import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.NUXT_ENV_OPENAI_ORG_ID,
    apiKey: process.env.NUXT_ENV_OPENAI_API_KEY,
});

export async function openaiGenerateStudyTools({ input, notename }) {
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `You are a student study aid. Here is the context for your task: ${notename}. Your task is to create flashcards that are a mix of definitions and quiz questions, for each entry in this list: ${input}. Return the flashcards in the following structure: [{cardprompt: 'flashcard prompt', cardanswer: 'flashcard answer'},...]`}],
    });
    let resText = completion.data.choices[0].message.content
    if (resText[resText.length - 1] != ']') {
        while (resText[resText.length - 1] != '}') {
            resText = resText.slice(0, -1)
        }
        resText += ']'
    }
    const res = JSON.parse(resText)
    return res ?? null
}
