export type PersonaState = "idle" | "listening" | "thinking" | "speaking";

export type TranscriptRole = "ai" | "user" | "system";

export interface TranscriptItem {
  id: string;
  role: TranscriptRole;
  text: string;
  timestamp: string;
}

export interface InterviewMessage {
  type: string;
  content?: string;
  transcript?: string;
  confidence?: number;
  turn?: number;
  is_final?: boolean;
  action?: string;
  message?: string;
}

export interface InterviewSocketState {
  connected: boolean;
  personaState: PersonaState;
  question: string;
  questionTags: string[];
  turn: number;
  transcript: TranscriptItem[];
  micOn: boolean;
  camOn: boolean;
  error: string | null;
}
