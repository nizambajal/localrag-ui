import { Component, computed, input } from '@angular/core';
import { SearchResultDto } from '../../models/search.models';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [], //TODO: Not there in ai. I just kept for behaviour check. Once learnt, remove.
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss',
})
export class ResultCardComponent {
  readonly result = input.required<SearchResultDto>();
  readonly queryTerms = input<string[]>([]);

  readonly scorePercent = computed(() => {
    const score = this.result().score;

    if (!score || isNaN(score) || !isFinite(score)) return 0;
    // Score is already scaled (combinedScore * 1000 gives ~8-16 range)
    // Normalise to 0-100 by treating 20 as 100%
    // const scaled = score > 1 ? score : score * 1000;
    return Math.min(100, Math.round((score / 20) * 100));
  });

  readonly scoreClass = computed(() => {
    const s = this.result().score;
    if (!s || isNaN(s)) return 'score--low';
    // Thresholds based on scaled score (combinedScore * 1000)
    if (s >= 12) return 'score--high';
    if (s >= 7) return 'score--medium';
    return 'score--low';
  });

  readonly highlightedContent = computed(() => {
    let text = this.result().content;
    const terms = this.queryTerms();
    if (!terms.length) return text;

    // Simple word-boundary highlight
    for (const term of terms) {
      // const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
      const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
      text = text.replace(regex, '<mark>$1</mark>');
    }

    return text;
  });
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
