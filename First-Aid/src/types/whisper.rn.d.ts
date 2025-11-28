declare module 'whisper.rn' {
  export interface WhisperContext {
    transcribe(
      audioUri: string,
      options?: {
        language?: string;
        maxLen?: number;
        tokenTimestamps?: boolean;
        speedUp?: boolean;
      }
    ): Promise<string | { result: string } | { text: string }>;
    release(): Promise<void>;
  }

  export interface WhisperConfig {
    filePath: string;
  }

  export function initWhisper(config: WhisperConfig): Promise<WhisperContext>;
  
  const whisper: {
    initWhisper: (config: WhisperConfig) => Promise<WhisperContext>;
  };
  export default whisper;
}
