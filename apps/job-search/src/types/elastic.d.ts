export type TIndexSchema = {
  index: string;
  body: {
    settings: {
      number_of_shards: number;
      number_of_replicas: number;
      analysis: {
        analyzer: {
          job_analyzer: {
            type: string;
            tokenizer: string;
            filter: string[];
          };
        };
      };
    };
    mappings: {
      properties: Record<string, unknown>;
    };
  };
};

export type OperationResult = { ok: true } | { ok: false; error: string };

export type DocumentData = {
  id: string;
  [key: string]: unknown;
};

export type SearchResponse<T> =
  | {
      ok: true;
      data: T[];
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  | { ok: false; error: string };
// type SearchSuccess<T = Record<string, unknown>> = {
//   _shards: {
//     total: number;
//     successful: number;
//     skipped: number;
//     failed: number;
//   };
//   hits: {
//     total: {
//       value: number;
//       relation: 'eq';
//     };
//     max_score: number;
//     hits: [
//       {
//         _index: string;
//         _type: '_doc';
//         _id: string;
//         _score: number;
//         _source: T;
//       }
//     ];
//   };
// };

// type SearchError = {
//   error: {
//     type: string;
//     reason: string;
//     line: number;
//     col: number;
//   };
//   status: number;
// };
