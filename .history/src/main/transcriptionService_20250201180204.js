const { ipcMain } = require('electron');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
const { Readable } = require('stream');

// 加载环境变量
dotenv.config();

const apiKey = process.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey: apiKey
});

const transcriptionService = {
  init() {
    ipcMain.handle('transcribe-audio', async (_event, audioData) => {
      try {
        // 将 Uint8Array 转换为 Buffer
        const buffer = Buffer.from(audioData);
        
        // 创建可读流
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        const transcription = await groq.audio.transcriptions.create({
          file: stream,
          model: "whisper-large-v3",
          response_format: "verbose_json"
        });
        
        return transcription;
      } catch (error) {
        console.error('Transcription error:', error);
        throw error;
      }
    });
  }
};

module.exports = transcriptionService; 