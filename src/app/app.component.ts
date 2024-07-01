import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  template: `
    <input [value]="q" #questionInput type="text" />
    <button (click)="prompt(questionInput)">send</button>
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
  chatSession: any;
  q = '';
  ai = (window as any)['ai'];
  history: { q: string; a: string[] }[] = [];
  async ngOnInit() {
    this.chatSession = await this.ai.createTextSession();
  }

  async prompt(input: HTMLInputElement) {
    const a = await this.chatSession.prompt(input.value);
    const p: { q: string; a: string[] } = { q: input.value, a: a.split('\n') };
    this.history.push(p);
    console.log(a);
    input.value = '';
  }
}
