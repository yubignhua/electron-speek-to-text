# Speech-to-Text Application

[中文 README](./README.md)

This is a desktop application built with Electron and Vue 3, utilizing the Groq API to implement speech-to-text functionality.

## Features

- Record audio using the system microphone
- Real-time recording status display
- Speech-to-text conversion using the Groq API
- Clean and user-friendly interface

## Installation Instructions

1. Clone the project

```bash
git clone [project URL]
cd electron-speech
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

- Copy the `.env.example` file to `.env`
- Add your Groq API key to the `.env` file:

```
GROQ_API_KEY=your-api-key-here
```

4. Run the development environment

```bash
npm start
```

5. Build the application

```bash
npm run build
```

## Usage Instructions

1. Launch the application and click the "Start Recording" button to begin recording.
2. Observe the recording status indicator while speaking.
3. Click the "Stop Recording" button to end the recording.
4. Wait a few seconds, and the transcription result will appear below.

## Technology Stack

- Electron
- Vue 3 + TypeScript
- Groq API
- node-record-lpcm16

## Development Roadmap

- [ ] Add audio volume visualization
- [ ] Support multiple audio formats
- [ ] Add history recording feature
- [ ] Support exporting transcription results

## Main Features

1. **Recording Functionality**:
   - Uses the `node-record-lpcm16` library for system microphone recording
   - Supports high-quality recording at 16kHz sampling rate
   - Real-time recording status display

2. **Speech-to-Text**:
   - Utilizes the Groq API for speech recognition
   - Supports real-time transcription
   - Includes error handling and status prompts

3. **User Interface**:
   - Simple button controls
   - Real-time status display
   - Elegant design

## Usage Instructions

1. Obtain a Groq API key and configure it in the `.env` file.
2. Launch the application and click the "Start Recording" button to begin recording.
3. The button will turn red during recording, indicating active recording.
4. Click the "Stop Recording" button to end the recording and wait for the transcription result.

## Notes

- Ensure the system microphone is functioning and has been granted permission for use by the application.
- A stable internet connection is required.
- Recording quality may affect transcription accuracy.

Before using, ensure:

- All dependencies are installed (`npm install`)
- The Groq API key is configured
- The system microphone is available and authorized

