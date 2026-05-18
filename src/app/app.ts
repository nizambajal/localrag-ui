import { Component, signal, computed, ViewChild, inject } from '@angular/core';
import { RagService } from './services/rag.service';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { IndexStatusComponent } from './components/index-status/index-status.component';
import { ChatComponent } from './components/chat/chat.component';
import { HybridSearchResultDto } from './models/search.models';

type Tab = 'search' | 'chat';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SearchBarComponent,
    ResultCardComponent,
    IndexStatusComponent,
    ChatComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild(SearchBarComponent) searchBar!: SearchBarComponent;
  private readonly svc = inject(RagService);

  readonly activeTab = signal<Tab>('search');
  readonly results = signal<HybridSearchResultDto[]>([]);
  readonly elapsed = signal('');
  readonly error = signal('');
  readonly hasSearched = signal(false);
  readonly lastQuery = signal('');
  readonly topK = signal(5);

  readonly queryTerms = computed(() =>
    this.lastQuery().trim().toLowerCase().split(/\s+/).filter(Boolean),
  );

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  onSearch(query: string): void {
    this.lastQuery.set(query);
    this.hasSearched.set(true);
    this.error.set('');
    this.searchBar?.setLoading(true);

    this.svc
      .hybridSearch({
        query,
        topK: this.topK(),
        vectorWeight: 0.7,
        bm25Weight: 0.3,
      })
      .subscribe({
        next: (resp) => {
          this.results.set(resp.results);
          this.elapsed.set(this.fmt(resp.elapsed));
          this.searchBar?.setLoading(false);
        },
        error: () => {
          this.error.set(
            'Could not reach the API. Is the .NET server running?',
          );
          this.searchBar?.setLoading(false);
        },
      });
  }

  onTopKChange(e: Event): void {
    this.topK.set(Number((e.target as HTMLSelectElement).value));
  }

  private fmt(ts: string): string {
    const parts = ts.split(':');
    if (parts.length < 3) return ts;
    const ms = Math.round(parseFloat(parts[2]) * 1000);
    return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
  }
}
