export const slackPost = async (text: string, channelId: string) => {
  const url = "https://slack.com/api/chat.postMessage";
  const body = {
    text,
    channel: channelId,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Deno.env.get("SLACK_API_KEY")}`,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  };
  await fetch(url, options);
};
