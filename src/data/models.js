export const categories = ['Text', 'Image', 'Video', 'Audio'];

export const modelCatalog = [
  { id: 'bytedance/seedance-2.5', name: 'Seedance 2.5', provider: 'ByteDance', kind: 'Video', unit: 'second', rate: 0.23112, detail: '720p', description: 'Direct multi-shot scenes with reference images, precise motion and synchronized audio.' },
  { id: 'openai/gpt-6.2-sol', name: 'GPT-6.2 Sol', provider: 'OpenAI', kind: 'Text', unit: '1M tokens', rate: 2, outputRate: 10, detail: 'Coding & reasoning', description: 'A general-purpose model for coding, research and workflows that require precise instructions.' },
  { id: 'google/nano-banana-pro', name: 'Nano Banana Pro', provider: 'Google', kind: 'Image', unit: 'image', rate: 0.134, detail: '1K or 2K', description: 'Create art-directed images, readable typography and careful edits from visual references.' },
  { id: 'anthropic/claude-opus-5.5', name: 'Claude Opus 5.5', provider: 'Anthropic', kind: 'Text', unit: '1M tokens', rate: 4, outputRate: 20, detail: 'Long-context reasoning', description: 'A reasoning model for multi-step tasks, long documents and agentic software work.' },
  { id: 'kling/kling-4.0', name: 'Kling 4.0', provider: 'Kling AI', kind: 'Video', unit: 'second', rate: 0.085, detail: '1080p', description: 'Turn a prompt or references into character-driven video with controlled camera movement.' },
  { id: 'suno/suno-v6', name: 'Suno V6', provider: 'Suno', kind: 'Audio', unit: 'generation', rate: 0.06, detail: 'Music generation', description: 'Generate complete songs, instrumentals and vocals from lyrics or a direction.' },
  { id: 'openai/gpt-image-2.6', name: 'GPT Image 2.6', provider: 'OpenAI', kind: 'Image', unit: 'image', rate: 0.053, detail: '1K', description: 'Generate and edit images with nuanced composition and accurate text rendering.' },
  { id: 'google/veo-3.1', name: 'Veo 3.1', provider: 'Google', kind: 'Video', unit: 'second', rate: 0.4, detail: '1080p', description: 'Generate cinematic footage with native sound and flexible framing.' },
  { id: 'google/gemini-4-hydrogen', name: 'Gemini 4 Hydrogen', provider: 'Google', kind: 'Text', unit: '1M tokens', rate: 1.5, outputRate: 7.5, detail: 'Multimodal reasoning', description: 'Work across language, imagery and long context in a single request.' },
  { id: 'alibaba/wan-3.0', name: 'Wan 3.0', provider: 'Alibaba', kind: 'Video', unit: 'second', rate: 0.08, detail: '720p', description: 'Use text, image and video references to guide longer clips and consistent subjects.' },
  { id: 'bytedance/seedream-5.5', name: 'Seedream 5.5', provider: 'ByteDance', kind: 'Image', unit: 'image', rate: 0.036, detail: '2K', description: 'Generate detailed images and refine selected regions while preserving the rest of the frame.' },
  { id: 'black-forest-labs/flux-2-pro', name: 'FLUX.2 Pro', provider: 'Black Forest Labs', kind: 'Image', unit: 'megapixel', rate: 0.03, detail: 'Image generation', description: 'Generate precise scenes and edit with several reference images.' },
  { id: 'elevenlabs/eleven-v4', name: 'Eleven v4', provider: 'ElevenLabs', kind: 'Audio', unit: '1K characters', rate: 0.1, detail: 'Text to speech', description: 'Generate expressive dialogue and narration for clips, podcasts and voice interfaces.' },
  { id: 'deepseek/deepseek-v4.1-flash', name: 'DeepSeek V4.1 Flash', provider: 'DeepSeek', kind: 'Text', unit: '1M tokens', rate: 0.15, outputRate: 0.45, detail: 'Fast inference', description: 'Efficient text and coding inference for interactive tools and high-volume batches.' },
  { id: 'minimax/speech-2.8-hd', name: 'MiniMax Speech 2.8 HD', provider: 'MiniMax', kind: 'Audio', unit: '1K characters', rate: 0.06, detail: 'Text to speech', description: 'Generate natural multilingual speech with fine control over rhythm and emphasis.' },
];

export function formatRate(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 5,
  }).format(amount);
}
