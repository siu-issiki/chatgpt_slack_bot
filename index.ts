import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();
const router = new Router();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`
  );
});

app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

const url = "https://api.openai.com/v1/completions";
const apiKey = Deno.env.get("OPENAI_API_KEY");
router.get("/", async (ctx) => {
  const prompt = "健康に良い習慣を教えてください";
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

  ctx.response.body = await res.json();
});

router.get("/slack_event", async (ctx) => {
  const { challenge } = await ctx.request.body({ type: "json" }).value;

  ctx.response.body = challenge;
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
