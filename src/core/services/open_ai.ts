import OpenAI from "openai";
import { config } from "../config";
import { ChatCompletionMessage } from "openai/resources/index.mjs";

type Message = {
  content: string;
  role: "system" | "user" | "assistant";
  name?: string;
};
export class AiService {
  openai;
  constructor() {
    this.openai = new OpenAI({ apiKey: config.openai.key });
  }

  static createUserMessage(content: string): Message {
    return { content: content, role: "user" };
  }

  static createSystemMessage(content: string): Message {
    return { content: content, role: "system" };
  }

  async queryQuickExercise(description: string) {
    const messages: Message[] = [];
    messages.push(AiService.createSystemMessage(prompts.quickExercise));
    messages.push(AiService.createUserMessage(description));
    const response = await this.openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });
    return response.choices[0].message.content;
  }
}

const prompts = {
  quickExercise: `You're a helpfull english teacher assistant, your role is to provide 10 different exercises in MARKDOWN style, 
    each fitting the description provided by the user, these exercises can be either multiple choice, fill the blank, assemble the phrase.`,
};
