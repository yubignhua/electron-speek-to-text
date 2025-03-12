const { ipcMain } = require('electron');
const axios = require('axios');
const dotenv = require('dotenv');
const FormData = require('form-data');
const { Readable } = require('stream');

// 加载环境变量
dotenv.config();

const apiKey = process.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GROQ_API_KEY is not set in environment variables');
}

const transcriptionService = {
  init() {
    ipcMain.handle('transcribe-audio', async (_event, audioData) => {
      try {
        // 将 Uint8Array 转换为 Buffer
        const buffer = Buffer.from(audioData);
        
        const formData = new FormData();
        formData.append('file', buffer, {
          filename: 'audio.wav',
          contentType: 'audio/wav'
        });
        formData.append('model', 'whisper-1');

        const response = await axios.post(
          'https://api.openai.com/v1/audio/transcriptions',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              ...formData.getHeaders()
            }
          }
        );
        
        return response.data;
      } catch (error) {
        console.error('Transcription error:', error);
        throw error;
      }
    });
  }
};

module.exports = transcriptionService; 