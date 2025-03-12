const { ipcMain } = require('electron');
const axios = require('axios');
const dotenv = require('dotenv');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 加载环境变量
dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

// 创建 axios 实例
const groqClient = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json'
  }
});

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

        // 创建 FormData 实例
        const formData = new FormData();
        
        // 读取文件并添加到 FormData
        const fileStream = fs.createReadStream(tempFile);
        formData.append('file', fileStream, {
          filename: 'audio.webm',
          contentType: 'audio/webm'
        });
        formData.append('model', 'whisper-large-v3');
        
        console.log('准备发送请求到 Groq API...');
        
        const response = await groqClient.post('/audio/transcriptions', formData, {
          headers: {
            ...formData.getHeaders()
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        });

        // 删除临时文件
        fs.unlinkSync(tempFile);
        console.log('临时文件已删除');
        console.log('API 响应:', response.data);
        
        return response.data;
      } catch (error) {
        console.error('转写错误:', error.message);
        if (error.response) {
          console.error('错误状态:', error.response.status);
          console.error('错误数据:', JSON.stringify(error.response.data, null, 2));
          console.error('错误头:', JSON.stringify(error.response.headers, null, 2));
        } else if (error.request) {
          console.error('请求错误:', error.request);
        } else {
          console.error('完整错误:', error);
        }
        throw error;
      }
    });
  }
};

module.exports = transcriptionService; 