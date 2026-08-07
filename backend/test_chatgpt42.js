import axios from "axios";
import "dotenv/config";

const options = {
  method: 'POST',
  url: 'https://chatgpt-42.p.rapidapi.com/gpt4',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': "chatgpt-42.p.rapidapi.com",
    'Content-Type': 'application/json'
  },
  data: {
    messages: [
      {
        role: "user",
        content: "hi"
      }
    ],
    web_access: false
  }
};

async function test() {
    try {
        console.log("Testing ChatGPT-42 on RapidAPI...");
        const response = await axios.request(options);
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
}

test();
