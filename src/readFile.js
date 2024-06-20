import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { aiTranslate } from "./chat.js"; // 假设你有一个aiTranslate函数用于调用OpenAI的API
import stream from "./fetch.js";
// 获取当前文件的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const example = `英文字幕翻译成中英文对照的字幕：
1
00:00:01,000 --> 00:00:04,000
Hello, everyone. Welcome to this introduction.

翻译后格式示例：
1
00:00:01,000 --> 00:00:04,000
大家好，欢迎观看这段介绍。
Hello, everyone. Welcome to this introduction.
`;

// 定义读取文件的目录路径和写入文件的目录路径
const sourceDirectory = path.join(__dirname, "srt1"); // 修改为你的.srt文件夹路径
const destinationDirectory = path.join(__dirname, "new_srt");

// 如果目标目录不存在，则创建目标目录
if (!fs.existsSync(destinationDirectory)) {
  fs.mkdirSync(destinationDirectory);
}

// 读取源目录下的所有文件并处理
fs.readdir(sourceDirectory, async (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  for (const file of files) {
    if (path.extname(file) === ".srt") {
      const filePath = path.join(sourceDirectory, file);
      const content = fs.readFileSync(filePath, "utf8");

      const prompt = `你是一个字幕翻译专家，请将英文字幕文件${content}\n一一对照翻译成中英文(上面中文下面英文)的字幕文件\n
示例如下：${example}\n注意：只返回翻译后的字幕内容，其他都不要返回！`;

      try {
        const data = await stream(prompt);
        const newFilePath = path.join(destinationDirectory, file);
        fs.writeFileSync(newFilePath, data, "utf8");
        console.log(
          `File ${file} has been translated and written to ${newFilePath}`
        );
      } catch (error) {
        console.error(`Error translating file ${file}:`, error);
      }
    }
  }
});
