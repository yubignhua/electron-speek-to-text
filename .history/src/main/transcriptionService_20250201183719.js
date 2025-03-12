const { ipcMain } = require('electron');
const { Groq } = require('groq-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const os = require('os');
const FormData = require('form-data');
const axios = require('axios');

// 加载环境变量
dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

const transcriptionService = {
  init() {
    ipcMain.handle('transcribe-audio', async (_event, audioData) => {
      try {
        console.log('开始处理音频转写请求...');
        
        // 将 Uint8Array 转换为临时文件
        const tempDir = os.tmpdir();
        const tempFile = path.join(tempDir, 'audio.webm');
        fs.writeFileSync(tempFile, Buffer.from(audioData));
        console.log('临时文件已创建:', tempFile);

        console.log('准备发送请求到 API...');
        
        // 创建 FormData
        const formData = new FormData();
        formData.append('file', fs.createReadStream(tempFile));
        formData.append('model', 'whisper-large-v3');
        formData.append('response_format', 'json');

        // 发送请求
        const response = await axios.post('https://api.groq.com/v1/audio/transcriptions', formData, {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${apiKey}`,
          }
        });

        // 删除临时文件
        fs.unlinkSync(tempFile);
        console.log('临时文件已删除');
        
        return response.data;
      } catch (error) {
        console.error('转写错误:', error.message);
        if (error.response) {
          console.error('错误状态:', error.response.status);
          console.error('错误数据:', JSON.stringify(error.response.data, null, 2));
        } else {
          console.error('完整错误:', error);
        }
        throw error;
      }
    });
  }
};

module.exports = transcriptionService; 