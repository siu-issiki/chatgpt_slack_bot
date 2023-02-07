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

router.post("/slack_event", async (ctx) => {
  const {
    event: { text },
  } = await ctx.request.body({ type: "json" }).value;

  const url =
    "https://hooks.slack.com/services/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";
  const body = {
    text,
  };
  const headers = {
    "Content-Type": "application/json",
  };
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  };
  await fetch(url, options);

  ctx.response.body = { text };
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
