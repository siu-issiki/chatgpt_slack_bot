import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { chatGPT } from "./chatgpt.ts";
import { slackPost } from "./slack.ts";

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

router.get("/", async (ctx) => {
  const prompt = "健康に良い習慣を教えてください";
  const res = await chatGPT(prompt);

  ctx.response.body = res;
});

router.post("/slack_event", async (ctx) => {
  const {
    bot_id,
    event: { text, channel },
  } = await ctx.request.body({ type: "json" }).value;

  console.log(await ctx.request.body({ type: "json" }).value);

  if (bot_id === undefined) {
    // const res = await chatGPT(text);
    // await slackPost(text, channel);
  }
  ctx.response.body = { text };
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
