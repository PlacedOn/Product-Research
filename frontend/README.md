# AI Interview Frontend

Production-grade, voice-first AI interviewer interface built with Next.js + Tailwind + Framer Motion.

## Design goals

- Premium minimal dark interface
- Persona-centric interview experience
- Real-time voice interaction flow
- Functional side panels without dashboard clutter

## Implemented structure

```text
frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Persona.tsx
│   ├── TranscriptPanel.tsx
│   ├── QuestionCard.tsx
│   ├── ControlDock.tsx
│   ├── VideoPanel.tsx
│   ├── TopBar.tsx
│   └── Background.tsx
├── lib/
│   ├── types.ts
│   └── useInterviewSocket.ts
├── tailwind.config.ts
└── package.json
```

## Realtime backend integration

The frontend connects to:

- WebSocket: `ws://127.0.0.1:8000/interaction/ws/{session_id}`

Set custom websocket URL with:

```bash
NEXT_PUBLIC_INTERVIEW_WS_URL=ws://localhost:8000/interaction/ws
```

## UI behavior

- Persona states:
  - Listening (`#22C55E`)
  - Thinking (`#6366F1`)
  - Speaking (`#38BDF8`)
- Floating question card updates from backend question events
- Transcript updates live with AI/user/system turns and timestamps
- Video panel shows mic/camera activity
- Control dock supports mic/camera toggle, push-to-talk, and end interview

## Run

From `frontend/`:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- UI is intentionally not a chat app: transcript is secondary, persona is center focus.
- Persona does not decide content; it only visualizes backend-driven interaction state.
