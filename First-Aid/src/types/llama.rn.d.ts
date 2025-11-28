declare module 'llama.rn' {
  export interface LlamaContext {
    completion(
      params: {
        prompt: string;
        n_predict?: number;
        temperature?: number;
        top_k?: number;
        top_p?: number;
        stop?: string[];
      },
      callback?: (data: { token: string }) => void
    ): Promise<{ text: string }>;
    release(): Promise<void>;
  }

  export interface LlamaConfig {
    model: string;
    n_ctx?: number;
    n_batch?: number;
    n_threads?: number;
    use_mlock?: boolean;
    n_gpu_layers?: number;
  }

  export function initLlama(config: LlamaConfig): Promise<LlamaContext>;
}
