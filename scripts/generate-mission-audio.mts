import fs from 'fs';
import path from 'path';
import { ElevenLabsClient } from 'elevenlabs';
import dotenv from 'dotenv';
import { mission00Audio } from '../src/config/audio/manifest.ts';

dotenv.config({ path: '.env.local' });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY in .env.local');
  process.exit(1);
}

const client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });

async function generateAudio(force = false, onlyId?: string) {
  for (const asset of mission00Audio) {
    if (onlyId && asset.id !== onlyId) {
      continue;
    }

    const outputFilePath = path.join(process.cwd(), 'public', asset.output);
    const outputDir = path.dirname(outputFilePath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (!force && fs.existsSync(outputFilePath)) {
      console.log(`[SKIPPED] ${asset.id} (File already exists: ${asset.output})`);
      continue;
    }

    console.log(`[GENERATING] ${asset.id}...`);
    try {
      const response = await client.textToSpeech.convert(asset.voiceId, {
        text: asset.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      });

      const fileStream = fs.createWriteStream(outputFilePath);
      for await (const chunk of response) {
        fileStream.write(chunk);
      }
      fileStream.end();

      console.log(`[SUCCESS] Saved to ${asset.output}`);
    } catch (error) {
      console.error(`[ERROR] Failed to generate ${asset.id}:`, error);
    }
  }
}

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyIndex = args.indexOf('--only');
const onlyId = onlyIndex !== -1 ? args[onlyIndex + 1] : undefined;

generateAudio(force, onlyId).then(() => {
  console.log('Audio generation completed.');
});

