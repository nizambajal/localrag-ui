import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RagService } from '../../services/rag.service';
import { ContextChunkDto } from '../../models/search.models';
import { MarkdownPipe } from '../../pipes/markdown-pipe';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources: ContextChunkDto[];
  elapsed: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, MarkdownPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private readonly svc = inject(RagService);

  readonly messages = signal<ChatMessage[]>([]);
  readonly loading = signal(false);

  query = '';
  topK = 5;
  expanded = new Set<number>();

  send(): void {
    const q = this.query.trim();
    if (!q || this.loading()) return;

    this.messages.update((msgs) => [
      ...msgs,
      { role: 'user', content: q, sources: [], elapsed: '' },
    ]);

    this.query = '';
    this.loading.set(true);

    this.svc.chat({ query: q, topK: this.topK }).subscribe({
      next: (resp) => {
        this.messages.update((msgs) => [
          ...msgs,
          {
            role: 'assistant',
            content: resp.answer,
            sources: resp.sourceChunks,
            elapsed: this.fmt(resp.elapsed),
          },
        ]);
        this.loading.set(false);
      },
      error: () => {
        this.messages.update((msgs) => [
          ...msgs,
          {
            role: 'assistant',
            content: '⚠️ Could not reach the API.',
            sources: [],
            elapsed: '',
          },
        ]);
        this.loading.set(false);
      },
    });
  }

  toggleSources(i: number): void {
    this.expanded.has(i) ? this.expanded.delete(i) : this.expanded.add(i);
  }

  onKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  private fmt(ts: string): string {
    const parts = ts.split(':');
    if (parts.length < 3) return ts;
    const ms = Math.round(parseFloat(parts[2]) * 1000);
    return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
  }
}
