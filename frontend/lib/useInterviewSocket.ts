"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { InterviewSocketState, TranscriptItem } from "@/lib/types";

const initialState: InterviewSocketState = {
  connected: true,
  personaState: "idle",
  question: "Waiting for interviewer...",
  questionTags: [],
  turn: 0,
  transcript: [],
  micOn: true,
  camOn: true,
  error: null,
};

interface GenerateQuestionResponse {
  question: string;
  skill: string;
  difficulty: "easy" | "medium" | "hard";
  type: "conceptual" | "system_design" | "behavioral";
  tags?: string[];
}

interface EvaluateAnswerResponse {
  score: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  missing_concepts: string[];
}

function stamp(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useInterviewSocket(sessionId: string) {
  const [state, setState] = useState<InterviewSocketState>(initialState);

  const candidateProfile = useMemo(
    () => ({
      name: "Candidate",
      experience_years: 2,
      skills: ["Node", "API design", "React"],
      projects: ["Realtime collaboration platform"],
      education: "B.Tech",
    }),
    [],
  );

  const jobProfile = useMemo(
    () => ({
      role: "Backend Engineer",
      level: "mid" as const,
      required_skills: ["API design", "databases", "caching"],
      preferred_skills: ["distributed systems"],
    }),
    [],
  );

  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_INTERVIEW_API_URL ?? "http://127.0.0.1:8000";
  }, [sessionId]);

  const addTranscript = useCallback((item: TranscriptItem) => {
    setState((prev) => ({ ...prev, transcript: [...prev.transcript, item] }));
  }, []);

  const postJSON = useCallback(
    async <TResponse,>(path: string, payload: object): Promise<TResponse> => {
      let lastError: Error | null = null;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const response = await fetch(`${apiBase}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return (await response.json()) as TResponse;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error("Unknown request error");
          if (attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }

      throw lastError ?? new Error("Unknown request error");
    },
    [apiBase],
  );

  const fetchQuestion = useCallback(
    async () => {
      setState((prev) => ({ ...prev, personaState: "thinking", error: null }));
      const next = await postJSON<GenerateQuestionResponse>("/generate-question", {
        session_id: sessionId,
        candidate: candidateProfile,
        job: jobProfile,
      });

      setState((prev) => ({
        ...prev,
        question: next.question,
        questionTags: next.tags ?? [],
        turn: prev.turn + 1,
        personaState: "speaking",
      }));

      addTranscript({
        id: `q-${Date.now()}`,
        role: "ai",
        text: next.question,
        timestamp: stamp(),
      });

      setTimeout(() => {
        setState((prev) => ({ ...prev, personaState: prev.micOn ? "listening" : "idle" }));
      }, 250);

      return next;
    },
    [addTranscript, candidateProfile, jobProfile, postJSON, sessionId],
  );

  const evaluateCurrentAnswer = useCallback(
    async (answer: string) => {
      const question = state.question;
      const result = await postJSON<EvaluateAnswerResponse>("/evaluate-answer", {
        session_id: sessionId,
        question,
        answer,
      });
      const evaluationText = `Score ${result.score.toFixed(2)} | Confidence ${result.confidence.toFixed(2)}${
        result.strengths.length ? ` | Strength: ${result.strengths[0]}` : ""
      }${result.weaknesses.length ? ` | Weakness: ${result.weaknesses[0]}` : ""}`;
      addTranscript({
        id: `eval-${Date.now()}`,
        role: "system",
        text: evaluationText,
        timestamp: stamp(),
      });

      await fetchQuestion();
    },
    [addTranscript, fetchQuestion, postJSON, sessionId, state.question],
  );

  const connect = useCallback(async () => {
    try {
      await fetchQuestion();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to connect interview";
      setState((prev) => ({ ...prev, personaState: "idle", error: message }));
      addTranscript({
        id: `err-${Date.now()}`,
        role: "system",
        text: `Connection error: ${message}`,
        timestamp: stamp(),
      });
    }
  }, [addTranscript, fetchQuestion]);

  useEffect(() => {
    void connect();
    return () => undefined;
  }, [connect]);

  const toggleMic = useCallback(() => {
    setState((prev) => {
      const nextMic = !prev.micOn;
      return { ...prev, micOn: nextMic, personaState: nextMic ? "listening" : "idle" };
    });
  }, []);

  const toggleCam = useCallback(() => {
    setState((prev) => ({ ...prev, camOn: !prev.camOn }));
  }, []);

  const pushToTalk = useCallback(async () => {
    if (!state.micOn) {
      return;
    }
    const answer = window.prompt("Enter your answer")?.trim();
    if (!answer) {
      return;
    }

    addTranscript({
      id: `u-${Date.now()}`,
      role: "user",
      text: answer,
      timestamp: stamp(),
    });

    setState((prev) => ({ ...prev, personaState: "thinking", error: null }));

    try {
      await evaluateCurrentAnswer(answer);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to evaluate answer";
      setState((prev) => ({ ...prev, personaState: "listening", error: message }));
      addTranscript({
        id: `err-${Date.now()}`,
        role: "system",
        text: `Evaluation error: ${message}`,
        timestamp: stamp(),
      });
    }
  }, [addTranscript, evaluateCurrentAnswer, state.micOn]);

  const endInterview = useCallback(() => {
    setState({
      ...initialState,
      transcript: [
        {
          id: `sys-${Date.now()}`,
          role: "system",
          text: "Interview ended.",
          timestamp: stamp(),
        },
      ],
    });
  }, []);

  return {
    state,
    connect,
    toggleMic,
    toggleCam,
    pushToTalk,
    endInterview,
  };
}
