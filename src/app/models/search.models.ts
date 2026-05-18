// ── DTOs ────────────────────────────────────────────────────────────────────
export interface BaseResultDto {
  chunkId: string;
  content: string;
  sourceFile: string;
  pageNumber: number;
  chunkIndex: number;
  rank: number;
  score: number; // vector-only uses 'score', hybrid maps combinedScore here
}

export interface SearchResultDto extends BaseResultDto {}

export interface HybridSearchResultDto extends BaseResultDto {
  vectorScore: number;
  bm25Score: number;
  combinedScore: number;
}

export interface ContextChunkDto {
  sourceFile: string;
  pageNumber: number;
  chunkIndex: number;
  content: string;
  score: number;
}

// ── Requests ────────────────────────────────────────────────────────────────────
export interface SearchRequest {
  query: string;
  topK: number;
}

export interface HybridSearchRequest {
  query: string;
  topK: number;
  vectorWeight?: number;
  bm25Weight?: number;
}

export interface ChatRequest {
  query: string;
  topK: number;
  vectorWeight?: number;
  bm25Weight?: number;
}

// ── Responses ────────────────────────────────────────────────────────────────────
export interface SearchResponse {
  results: SearchResultDto[];
  elapsed: string;
}

export interface HybridSearchResponse {
  results: HybridSearchResultDto[];
  elapsed: string;
}

export interface ChatResponse {
  answer: string;
  sourceChunks: ContextChunkDto[];
  elapsed: string;
}

// ── Index ─────────────────────────────────────────────────────────────────────

export interface IndexStats {
  vectorCount: number;
}

export interface IndexingJob {
  id: string;
  fileName: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  totalChunks: number;
  processedChunks: number;
  errorMessage: string | null;
  startedAt: string;
  finishedAt: string | null;
}
