import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  computed,
} from '@angular/core';
import { interval, Subscription, startWith, switchMap } from 'rxjs';
import { RagService } from '../../services/rag.service';
import { IndexStats, IndexingJob } from '../../models/search.models';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-index-status',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './index-status.component.html',
  styleUrl: './index-status.component.scss',
})
export class IndexStatusComponent implements OnInit, OnDestroy {
  private readonly svc = inject(RagService);

  readonly stats = signal<IndexStats | null>(null);
  readonly jobs = signal<IndexingJob[]>([]);

  private sub?: Subscription;

  ngOnInit(): void {
    // Poll every 5 seconds
    this.sub = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.svc.getStats()),
      )
      .subscribe((s) => this.stats.set(s));

    this.svc.getJobs().subscribe((j) => this.jobs.set(j));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  statusLabel(status: IndexingJob['status']): string {
    return { Pending: '⏳', Processing: '⚙️', Completed: '✅', Failed: '❌' }[
      status
    ];
  }

  readonly completedCount = computed(
    () => this.jobs().filter((j) => j.status === 'Completed').length,
  );

  readonly isIndexed = computed(() => (this.stats()?.vectorCount ?? 0) > 0);
}
