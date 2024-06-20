import { createJsonTranslator, createLanguageModel } from "typechat";
import { createTypeScriptJsonValidator } from "typechat/ts";
import dotenv from "dotenv";
dotenv.config();
//schema必须是一个字符串
const url = process.env.OPENAI_ENDPOINT;
const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  OPENAI_ENDPOINT: url,
};

const schema = `export type SrtFile = {
  content: string,
};`;
export async function aiTranslate(prompt) {
  const model = createLanguageModel(env);
  const validator = createTypeScriptJsonValidator(schema, "SrtFile");
  const translator = createJsonTranslator(model, validator);
  const response = await translator.translate(prompt);
  if (!response.success) {
    console.log(response.message);
    return;
  }

  return response.data;
}
// aiTranslate(prompt).then((data) => {
//   console.log(data);
// });
