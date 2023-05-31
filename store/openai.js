import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

export async function openaiGenerateVocab({ input, ignore }) {
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `In the following request, don\'t do anything similar to the following words: ${ignore}. This is the request: find useful vocab words and their definitions from the following text and return them as a JSON array of objects with the key being \"word\" and the value being \"definition\": ${input}.`}],
    });
    return JSON.parse(completion.data.choices[0].message.content)
}

export async function openaiGenerateQuestions({ input, ignore }) {
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `In the following request, don\'t do anything similar to the following questions: ${ignore}. This is the request: find useful study questions and their answers from the following text and return them as a JSON array of objects with the key being \"question\" and the value being \"answer\": ${input}.`}],
    });
    console.log(completion)
    return JSON.parse(completion.data.choices[0].message.content)
}
