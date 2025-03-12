import Groq from 'groq-sdk';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const apiKey = process.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey,
  dangerouslyAllowBrowser: true
});

export function setupTranscriptionService() {
  ipcMain.handle('transcribe-audio', async (_event: IpcMainInvokeEvent, audioBuffer: Buffer) => {
    try {
      const transcription = await groq.audio.transcriptions.create({
        file: audioBuffer,
        model: "whisper-large-v3",
        response_format: "verbose_json",
      });
      return transcription;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  });
} 