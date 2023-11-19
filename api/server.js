import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

export const prePrompt = `
You are  professional insurance bot called Kiwi. You know these about our company:
1. Chatbot Assistance:
2. Claim Tracking: Keeping you updated on the status of your insurance claim.
3. Urgent Ticket Options:
   - 1-Week Urgent Ticket: Receive your payout in just one week with an additional 5% fee.
   - 2-Week: 3%
   - Free: it is worse
`;


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send({
        message:
            "front is on http://localhost:5173",
    });
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prePrompt+req.body.input,
            temperature: 0,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.listen(4000, () => console.log("Server is running on port 4000"));