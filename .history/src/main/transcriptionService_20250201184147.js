const { ipcMain } = require('electron');
const { Groq } = require('groq-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 加载环境变量
dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

// 创建 Groq 客户端实例
const groq = new Groq({
  apiKey: apiKey,
  baseURL: 'https://api.groq.com/openai/v1'  // 使用 OpenAI 兼容的端点
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

        console.log('准备发送请求到 Groq API...');
        
        // 使用 groq-sdk 发送请求
        const transcription = await groq.audio.transcriptions.create({
          file: fs.createReadStream(tempFile),
          model: "whisper-large-v3",
          response_format: "text"  // 使用简单的文本格式
        });

        // 删除临时文件
        fs.unlinkSync(tempFile);
        console.log('临时文件已删除');
        
        return { text: transcription };
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