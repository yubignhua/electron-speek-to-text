const { ipcMain } = require('electron');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const os = require('os');
const FormData = require('form-data');
const axios = require('axios');

// 加载环境变量
dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
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

        console.log('准备发送请求到 Whisper API...');
        
        // 创建 FormData
        const formData = new FormData();
        formData.append('file', fs.createReadStream(tempFile));
        formData.append('model', 'whisper-1');
        formData.append('language', 'zh');
        formData.append('response_format', 'text');

        // 发送请求到 OpenAI Whisper API
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${openaiApiKey}`,
          },
          maxBodyLength: Infinity,
          timeout: 30000 // 30秒超时
        });

        // 删除临时文件
        fs.unlinkSync(tempFile);
        console.log('临时文件已删除');
        
        return { text: response.data };
      } catch (error) {
        console.error('转写错误:', error.message);
        if (error.response) {
          console.error('错误状态:', error.response.status);
          console.error('错误数据:', error.response.data);
        }
        console.error('完整错误:', error);
        throw error;
      }
    });
  }
};

module.exports = transcriptionService;