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
