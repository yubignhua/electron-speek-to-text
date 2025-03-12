import Groq from 'groq-sdk';
import { ipcMain } from 'electron';

const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export function setupTranscriptionService() {
  ipcMain.handle('transcribe-audio', async (event, audioBuffer: Buffer) => {
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