import axios from "axios";

async function stream(msg) {
  const URL = process.env.OPENAI_ENDPOINT;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  let controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
    console.error("Request timed out");
  }, 60000);

  try {
    const response = await axios({
      method: "POST",
      url: URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      data: {
        model: "gpt-4o",
        messages: [{ role: "user", content: msg }],
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status !== 200) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = response.data;
    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId); // 确保清除超时
    if (axios.isCancel(error)) {
      console.error("Request canceled:", error.message);
    } else {
      console.error("Fetch error:", error);
    }
    throw error;
  }
}

export default stream;

// stream("你好")
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error("Error in stream:", error);
//   });
