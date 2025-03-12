<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import * as recorder from 'node-record-lpcm16';

const isRecording = ref(false);
const transcribedText = ref('');
const recordInstance = ref<any>(null);
const audioChunks = ref<Buffer[]>([]);

/**
 * 开始录音
 */
const startRecording = () => {
  isRecording.value = true;
  audioChunks.value = [];

  recordInstance.value = recorder.record({
    sampleRate: 16000,
    channels: 1,
    audioType: 'wav',
  });

  recordInstance.value.stream().on('data', (chunk: Buffer) => {
    audioChunks.value.push(chunk);
  });
};

/**
 * 停止录音并发送到 Groq API
 */
const stopRecording = async () => {
  isRecording.value = false;
  if (recordInstance.value) {
    recordInstance.value.stop();
    
    try {
      const audioBuffer = Buffer.concat(audioChunks.value);
      const response = await axios.post(
        'https://api.groq.com/v1/audio/transcriptions',
        {
          file: audioBuffer,
          model: 'whisper-1'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      transcribedText.value = response.data.text;
    } catch (error) {
      console.error('转写失败:', error);
      transcribedText.value = '转写失败，请重试';
    }
  }
};

onUnmounted(() => {
  if (recordInstance.value) {
    recordInstance.value.stop();
  }
});
</script>

<template>
  <div class="speech-to-text">
    <h2>语音转文字</h2>
    
    <div class="controls">
      <button 
        @click="isRecording ? stopRecording() : startRecording()"
        :class="{ 'recording': isRecording }"
      >
        {{ isRecording ? '停止录音' : '开始录音' }}
      </button>
    </div>

    <div class="result">
      <h3>转写结果：</h3>
      <p>{{ transcribedText || '等待录音...' }}</p>
    </div>
  </div>
</template>

<style scoped>
.speech-to-text {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.controls {
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  border: none;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button.recording {
  background-color: #f44336;
}

button.recording:hover {
  background-color: #da190b;
}

.result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.result h3 {
  margin-top: 0;
  color: #333;
}

.result p {
  margin: 10px 0 0;
  color: #666;
  line-height: 1.5;
}
</style> 