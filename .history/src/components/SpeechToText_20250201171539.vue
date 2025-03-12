<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const isRecording = ref(false);
const transcribedText = ref('');
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);

/**
 * 请求麦克风权限并初始化录音
 */
const initRecorder = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { 
        type: 'audio/mp4' 
      });
      await sendAudioToGroq(audioBlob);
    };
  } catch (error) {
    console.error('无法访问麦克风:', error);
    transcribedText.value = '无法访问麦克风，请检查权限设置';
  }
};

/**
 * 开始录音
 */
const startRecording = () => {
  if (!mediaRecorder.value) {
    initRecorder();
    return;
  }
  
  audioChunks.value = [];
  isRecording.value = true;
  mediaRecorder.value.start();
};

/**
 * 停止录音
 */
const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    isRecording.value = false;
    mediaRecorder.value.stop();
  }
};

/**
 * 发送音频到Groq API
 */
const sendAudioToGroq = async (audioBlob: Blob) => {
  try {
    console.log('准备发送音频文件，大小:', audioBlob.size, '字节');
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp4');
    formData.append('model', 'whisper-1');

    console.log('开始发送请求到 Groq API...');
    const response = await axios.post(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('收到 API 响应:', response.data);
    transcribedText.value = response.data.text;
  } catch (error: any) {
    console.error('转写失败:', error.response?.data || error.message);
    console.error('完整错误信息:', error);
    transcribedText.value = '转写失败，请重试';
  }
};

onMounted(() => {
  initRecorder();
});

onUnmounted(() => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
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