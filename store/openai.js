import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.NUXT_ENV_OPENAI_ORG_ID,
    apiKey: process.env.NUXT_ENV_OPENAI_API_KEY,
});

export async function openaiGenerateStudyTools({ input, notename }) {
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `You are a student study aid. Here is the topic for your task: ${notename}. First, concisely define every word in this list: ${input}. Second, create unique and concise study questions from those words with their answers. Keep your whole response under 7000 characters. Return this information in the following structure: {words: [{cardprompt: 'word', cardanswer: 'definition'},...], questions: [{cardprompt: 'question', cardanswer: 'answer'},...]}.`}],
    });
    let resText = completion.data.choices[0].message.content
    if (resText[resText.length - 1] != '}') {
        while (resText[resText.length - 1] != '{') {
            resText = resText.slice(0, -1)
        }
        resText = resText.slice(0, -3) // remove the last '{' and ',' and maybe space, try -2 as well
        resText += ']}' // close the JSON
    }
    const res = JSON.parse(resText)
    return res ?? null
}
