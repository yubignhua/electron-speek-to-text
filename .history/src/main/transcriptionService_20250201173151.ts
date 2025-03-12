const Groq = require('groq-sdk');
const { ipcMain } = require('electron');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const apiKey = process.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey
});

function initTranscriptionService() {
  ipcMain.handle('transcribe-audio', async (_event, audioBuffer) => {
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

module.exports = {
  initTranscriptionService
}; 