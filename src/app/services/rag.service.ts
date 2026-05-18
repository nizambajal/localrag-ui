import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  SearchRequest,
  SearchResponse,
  HybridSearchRequest,
  HybridSearchResponse,
  ChatRequest,
  ChatResponse,
  IndexStats,
  IndexingJob,
} from '../models/search.models';

@Injectable({ providedIn: 'root' })
export class RagService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  // ── Vector only ───────────────────────────────────────────────────────────
  search(req: SearchRequest): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(`${this.base}/search`, req);
  }

  // ── Hybrid ────────────────────────────────────────────────────────────────
  hybridSearch(req: HybridSearchRequest): Observable<HybridSearchResponse> {
    return this.http.post<HybridSearchResponse>(
      `${this.base}/hybridsearch`,
      req,
    );
  }

  // ── Chat ──────────────────────────────────────────────────────────────────
  chat(req: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.base}/chat`, req);
  }

  // ── Index ─────────────────────────────────────────────────────────────────
  getStats(): Observable<IndexStats> {
    return this.http.get<IndexStats>(`${this.base}/index/stats`);
  }

  getJobs(): Observable<IndexingJob[]> {
    return this.http.get<IndexingJob[]>(`${this.base}/index/jobs`);
  }
}
