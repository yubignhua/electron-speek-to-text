const { ipcMain } = require('electron');
const { Groq } = require('groq-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { Readable } = require('stream');

// 加载环境变量
dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

// 创建 Groq 客户端实例
const groq = new Groq({
  apiKey: apiKey
});

const transcriptionService = {
  init() {
    ipcMain.handle('transcribe-audio', async (_event, audioData) => {
      try {
        console.log('开始处理音频转写请求...');
        
        // 将 Uint8Array 转换为 Buffer
        const buffer = Buffer.from(audioData);

        // 创建可读流
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        console.log('准备发送请求到 Groq API...');
        
        const transcription = await groq.audio.transcriptions.create({
          file: stream,
          model: "whisper-large-v3"
        });

        console.log('API 响应:', transcription);
        
        return transcription;
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