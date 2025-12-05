import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.NUXT_ENV_OPENAI_ORG_ID,
    apiKey: process.env.NUXT_ENV_OPENAI_API_KEY,
});

export async function openaiGenerateStudyTools({ input, notename }) {
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-5-mini",
        messages: [{role: "user", content: `You are a student study aid. Here is the context for your task: ${notename}. Your task is to create brief flashcards that are a mix of definitions and quiz questions, for each entry in this list: ${input}. Return the flashcards in the following structure: [{"cardprompt": "flashcard prompt", "cardanswer": "flashcard answer"},...]`}],
    });
    return cleanResponse(completion.data.choices[0].message.content)
}

export async function openaiTopicalFlashcards({ topic, numCards }) {
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
        model: "gpt-5-mini",
        messages: [{role: "user", content: `Create ${numCards} flashcards with various content (definitions, quiz questions, etc.) for the following topic: '${topic}'. Be concise. Return the flashcards in the following structure: [{"cardprompt": "flashcard prompt", "cardanswer": "flashcard answer"},...]`}],
    });
    return cleanResponse(completion.data.choices[0].message.content)
}

export async function openaiTopicalQuiz({ topic, numQuestions }) {
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
        model: "gpt-5-mini",
        messages: [{role: "user", content: `Create ${numQuestions} multiple choice quiz questions with four choices each for the following topic: '${topic}'. Be concise. Return the quiz in the following structure: [{"questiontext": "quiz question", "answers": [{"answer": "answer 1", "correct": true},...],...]`}],
    });
    return cleanResponse(completion.data.choices[0].message.content)
}

function cleanResponse(resText) {
    if (resText[resText.length - 1] != ']') {
        while (resText[resText.length - 1] != '}') {
            resText = resText.slice(0, -1)
        }
        resText += ']'
    }
    const res = JSON.parse(resText)
    return res ?? null
}
