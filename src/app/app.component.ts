// @ts-nocheck
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VoiceService } from './voice.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  template: `
    <button (click)="start()">Start</button>
    <button (click)="stop()">Stop</button>
    <input [value]="q" #questionInput type="text" />
    <button (click)="prompt(questionInput.value, selectedVoice.value)">
      send
    </button>
    <select (change)="setVoice($event)" #selectedVoice>
      <option>select</option>
      @for(voice of service.voices;track $index){
      <option [value]="$index">{{ voice.name }}</option>

      }</select
    >{{ selectedVoice.value }}
    <hr />
    @for(h of history;track $index){
    <div>
      <small>{{ h.q }}:</small><br />
      @for(s of h.a;track $index){
      <strong>{{ s }}</strong
      ><br />
      }
      <hr />
    </div>
    }
  `,
})
export class AppComponent implements OnInit {
  selectedId = 0;
  service = inject(VoiceService);
  recognition!: SpeechRecognition;
  chatSession: any;
  q = '';
  ai = (window as any)['ai'];
  history: { q: string; a: string[] }[] = [];
  cdr = inject(ChangeDetectorRef);

  start() {
    console.log('STart');
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.start();
    this.recognition.onresult = (event) => {
      const arr = event.results as SpeechRecognitionResultList;
      console.log(arr);
      this.prompt(arr[arr.length - 1][0].transcript, this.selectedId);
    };
  }
  stop() {
    this.recognition.stop();
    this.service.pause();
  }

  async ngOnInit() {
    this.chatSession = await this.ai.createTextSession();
  }

  async prompt(input: string, id: string) {
    const a = await this.chatSession.prompt(input);
    const p: { q: string; a: string[] } = { q: input, a: a.split('\n') };
    this.history.push(p);
    this.cdr.detectChanges();
    console.log(a);
    this.service.speak(a, parseInt(id));
    // input.value = '';
  }

  setVoice(e: Event) {
    this.selectedId = (e.target as HTMLSelectElement).value;
  }
}
