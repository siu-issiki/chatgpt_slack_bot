const url = "https://api.openai.com/v1/completions";
const apiKey = Deno.env.get("OPENAI_API_KEY");

export const chatGPT = async (prompt: string) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const body = {
    model: "text-davinci-003",
    max_tokens: 1024,
    temperature: 0.9,
    prompt,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  };
  const res = await fetch(url, options);
  const { choices } = await res.json();
  const text = choices[0].text;
  return text;
};
