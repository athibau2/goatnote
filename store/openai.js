import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

export async function openaiGenerateVocab({ input }) {
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `Find useful vocab words and their definitions from the following text and return them in an array of objects with the key being \"word\" and the value being \"definition\": ${input}.`}],
    });
    console.log(JSON.parse(completion.data.choices[0].message.content));
    return JSON.parse(completion.data.choices[0].message.content)
}

export async function openaiGenerateQuestions({ input }) {
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `Find useful study questions and their answers from the following text and return them in an array of objects with the key being \"question\" and the value being \"answer\": ${input}.`}],
    });
    console.log(JSON.parse(completion.data.choices[0].message.content));
    return JSON.parse(completion.data.choices[0].message.content)
}