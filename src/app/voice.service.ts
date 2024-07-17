// @ts-nocheck
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class VoiceService {
  speechRecognitionList!: any;
  voices: SpeechSynthesisVoice[] = [];
  voice!: SpeechSynthesisVoice;
  constructor() {
    speechSynthesis.onvoiceschanged = (event) => {
      const voices = speechSynthesis.getVoices();
      this.voices = voices.filter((lang) => lang.lang === 'en-US');
      console.log(this.voices);
      // console.log(voices[107]);
      this.voice = voices[0];
    };
  }

  speak(text: string, id: number = 0) {
    console.log(text, id);
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voices[id] as SpeechSynthesisVoice;
    utterance.pitch = 1.3;
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  }
  pause() {
    speechSynthesis.pause();
  }
}
