import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

function loadEnvLocal() {
  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const val = valueParts.join('=').trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

async function runIngestion() {
  loadEnvLocal();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is not defined in process.env or .env.local');
    process.exit(1);
  }

  console.log('[HealthBridge RAG Ingestion]: Connecting to Gemini API...');
  const ai = new GoogleGenAI({ apiKey });

  try {
    console.log('[HealthBridge RAG Ingestion]: Creating new Gemini File Search Store...');
    const store = await ai.fileSearchStores.create({
      config: {
        displayName: `HealthBridge Emergency Medical KB - ${Date.now()}`,
      },
    });

    if (!store.name) {
      throw new Error('Gemini API did not return a valid File Search Store name');
    }

    console.log(`[HealthBridge RAG Ingestion]: File Search Store created: ${store.name}`);

    const docsDir = path.join(process.cwd(), 'data', 'emergency-docs');
    if (!fs.existsSync(docsDir)) {
      throw new Error(`Documents directory does not exist: ${docsDir}`);
    }

    const docFiles = fs.readdirSync(docsDir).filter((f) => f.endsWith('.txt'));
    if (docFiles.length === 0) {
      throw new Error(`No .txt medical documents found in ${docsDir}`);
    }

    console.log(`[HealthBridge RAG Ingestion]: Found ${docFiles.length} approved medical documents to ingest.`);

    for (const file of docFiles) {
      const filePath = path.join(docsDir, file);
      console.log(`[HealthBridge RAG Ingestion]: Ingesting file "${file}" into ${store.name}...`);
      
      const op = await ai.fileSearchStores.uploadToFileSearchStore({
        fileSearchStoreName: store.name,
        file: filePath,
        config: {
          mimeType: 'text/plain',
        },
      });

      console.log(`[HealthBridge RAG Ingestion]: Successfully uploaded "${file}". Operation: ${op.name || 'completed'}`);
    }

    console.log('\n==================================================================');
    console.log('HEALTHBRIDGE EMERGENCY RAG INGESTION SUCCESSFUL!');
    console.log('==================================================================');
    console.log('Add this key and value to Vercel / Environment variables:');
    console.log('');
    console.log(`Key:   GEMINI_FILE_SEARCH_STORE`);
    console.log(`Value: ${store.name}`);
    console.log('==================================================================\n');

    // Automatically update or append GEMINI_FILE_SEARCH_STORE in .env.local for local testing
    const envLocalPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      let content = fs.readFileSync(envLocalPath, 'utf8');
      if (content.includes('GEMINI_FILE_SEARCH_STORE=')) {
        content = content.replace(/GEMINI_FILE_SEARCH_STORE=.*/g, `GEMINI_FILE_SEARCH_STORE=${store.name}`);
      } else {
        content += `\nGEMINI_FILE_SEARCH_STORE=${store.name}\n`;
      }
      fs.writeFileSync(envLocalPath, content, 'utf8');
      console.log(`[HealthBridge RAG Ingestion]: Updated .env.local with GEMINI_FILE_SEARCH_STORE=${store.name}`);
    }

  } catch (err: any) {
    console.error('[HealthBridge RAG Ingestion Failed]:', err);
    process.exit(1);
  }
}

runIngestion();
