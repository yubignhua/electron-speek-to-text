const { ipcMain } = require('electron');
const axios = require('axios');
const dotenv = require('dotenv');
const FormData = require('form-data');

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
          filename: 'audio.m4a',
          contentType: 'audio/m4a'
        });
        formData.append('model', 'whisper-large-v3');
        formData.append('response_format', 'verbose_json');

        const response = await axios.post(
          'https://api.groq.com/openai/v1/audio/transcriptions',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              ...formData.getHeaders()
            },
            maxBodyLength: Infinity,
            timeout: 60000 // 60秒超时
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