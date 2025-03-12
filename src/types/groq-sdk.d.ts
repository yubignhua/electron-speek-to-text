declare module 'groq-sdk' {
  interface GroqOptions {
    apiKey: string;
  }

  interface TranscriptionResponse {
    text: string;
    [key: string]: any;
  }

  interface AudioAPI {
    transcriptions: {
      create(options: {
        file: Buffer;
        model: string;
        response_format?: string;
      }): Promise<TranscriptionResponse>;
    };
  }

  class Groq {
    constructor(options: GroqOptions);
    audio: AudioAPI;
  }

  export default Groq;
} 