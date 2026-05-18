import {
  Component,
  output,
  signal,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  readonly search = output<string>();
  readonly loading = signal(false);

  query = '';

  private readonly input$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.input$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((q) => {
        if (q.trim().length >= 3) this.search.emit(q.trim());
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(): void {
    this.input$.next(this.query);
  }

  onSubmit(): void {
    if (this.query.trim().length >= 3) this.search.emit(this.query.trim());
  }

  setLoading(val: boolean): void {
    this.loading.set(val);
  }
}
