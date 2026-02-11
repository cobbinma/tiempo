import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

let isAudioConfigured = false;

/**
 * Configure audio session for iOS
 * This ensures audio plays even when the silent switch is on
 */
export const configureAudio = async () => {
  if (isAudioConfigured) return;
  
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    console.log('✅ Audio configured for speech');
    isAudioConfigured = true;
  } catch (error) {
    console.error('❌ Failed to configure audio:', error);
  }
};

/**
 * Speak text in Spanish with proper iOS audio handling
 */
export const speakSpanish = async (text: string): Promise<void> => {
  await configureAudio();
  
  return new Promise((resolve, reject) => {
    try {
      console.log('🔊 Speaking:', text);
      
      Speech.speak(text, {
        language: 'es-ES',
        rate: 0.75,
        pitch: 1.0,
        volume: 1.0,
        onStart: () => {
          console.log('▶️ Speech started');
        },
        onDone: () => {
          console.log('✅ Speech completed');
          resolve();
        },
        onStopped: () => {
          console.log('⏹️ Speech stopped');
          resolve();
        },
        onError: (error) => {
          console.error('❌ Speech error:', error);
          reject(error);
        },
      });
    } catch (error) {
      console.error('❌ Exception in speakSpanish:', error);
      reject(error);
    }
  });
};
