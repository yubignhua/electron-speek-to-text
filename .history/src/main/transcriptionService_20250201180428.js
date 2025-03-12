const { ipcMain } = require('electron');
const axios = require('axios');
const dotenv = require('dotenv');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
        // 将 Uint8Array 转换为临时文件
        const tempDir = os.tmpdir();
        const tempFile = path.join(tempDir, 'temp_audio.m4a');
        fs.writeFileSync(tempFile, Buffer.from(audioData));

        const formData = new FormData();
        formData.append('file', fs.createReadStream(tempFile));
        formData.append('model', 'whisper-large-v3');
        formData.append('response_format', 'verbose_json');

        const response = await axios.post(
          'https://api.groq.com/openai/v1/audio/transcriptions',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              ...formData.getHeaders()
            }
          }
        );

        // 删除临时文件
        fs.unlinkSync(tempFile);
        
        return response.data;
      } catch (error) {
        console.error('Transcription error:', error);
        throw error;
      }
    });
  }
};

module.exports = transcriptionService; 