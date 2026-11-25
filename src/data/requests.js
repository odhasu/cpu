export const quickstartModelId = 'openai/gpt-6.2-sol';

export const quickstartLanguages = ['cURL', 'JavaScript', 'Python'];

export function quickstart(language) {
  if (language === 'JavaScript') return `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.GATEWAY_URL,
  apiKey: process.env.GATEWAY_KEY,
});

const result = await client.chat.completions.create({
  model: "${quickstartModelId}",
  messages: [{ role: "user", content: "Say hello." }],
});
console.log(result.choices[0].message.content);`;
  if (language === 'Python') return `import os
from openai import OpenAI

client = OpenAI(
    base_url=os.environ["GATEWAY_URL"],
    api_key=os.environ["GATEWAY_KEY"],
)

result = client.chat.completions.create(
    model="${quickstartModelId}",
    messages=[{"role": "user", "content": "Say hello."}],
)
print(result.choices[0].message.content)`;
  return [
    'curl "$GATEWAY_URL/chat/completions" \\',
    '  -H "Authorization: Bearer $GATEWAY_KEY" \\',
    '  -H "Content-Type: application/json" \\',
    "  -d '{",
    `    "model": "${quickstartModelId}",`,
    '    "messages": [',
    '      { "role": "user", "content": "Say hello." }',
    '    ]',
    "  }'",
  ].join('\n');
}

export function requestFor(model, prompt, modelId = model.id) {
  if (model.kind === 'Text') {
    return { path: '/chat/completions', body: { model: modelId, messages: [{ role: 'user', content: prompt }] } };
  }
  if (model.kind === 'Image') {
    return { path: '/images/generations', body: { model: modelId, prompt } };
  }
  if (model.kind === 'Audio' && model.provider !== 'Suno') {
    return { path: '/audio/speech', body: { model: modelId, input: prompt, voice: 'default' } };
  }
  return { path: '/generations', body: { model: modelId, output: model.kind.toLowerCase(), prompt } };
}
