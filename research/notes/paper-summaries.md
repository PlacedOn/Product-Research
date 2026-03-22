# Research Paper Summaries

## Paper 1: Atom of Thoughts for Markov LLM Test-Time Scaling

**Citation:** Teng, F., Shi, Q., Yu, Z., Zhang, J., Luo, Y., Wu, C., & Guo, Z. (2025). Atom of Thoughts for Markov LLM Test-Time Scaling. NeurIPS 2025.

**ArXiv:** 2502.12018v4

### Core Idea
Uses the memoryless property of Markov chains to minimize historical dependency in LLM reasoning. Instead of carrying the full reasoning history (like Chain of Thought), each reasoning step produces a self-contained, simplified state that replaces all prior context.

### Key Mechanism
Two-phase state transition:
1. **Decomposition:** Build a DAG of the current problem's internal dependencies
2. **Contraction:** Solve independent sub-problems, bake results into a simpler equivalent problem

Plus a **judge** (LLM-as-a-judge) that verifies each transition preserves answer-equivalence with the original problem.

### Key Results
- Outperforms CoT, ToT, GoT, FoT across math, code, and multi-hop QA
- Scales efficiently — performance improves with more compute without cost exploding
- Atomic reasoning structures emerge naturally (irreducible problem units)
- Works with both reasoning and non-reasoning LLMs

### Application to PlacedOn
- Candidate state as Markov state (compressed, self-contained)
- DAG decomposition for adaptive interview planning
- Contraction for progressive profile refinement
- Judge for fidelity verification
- ~3-5x cost reduction vs. full-context approach

---

## Paper 2: ABLEIST — Intersectional Disability Bias in LLM-Generated Hiring Scenarios

**Citation:** Phutane, M., Jung, H., Kim, M., Mitra, T., & Vashistha, A. (2025). ABLEIST: Intersectional Disability Bias in LLM-Generated Hiring Scenarios.

**ArXiv:** 2510.10998v1

### Core Idea
Introduces the ABLEIST framework — 8 metrics (5 ableism-specific + 3 intersectional) to measure covert disability bias in LLM-generated hiring conversations. Finds pervasive, compounding bias across all 6 tested LLMs.

### Key Metrics
**Ableism-specific:** One-Size-Fits-All Ableism, Infantilization, Technoableism, Anticipated Ableism, Ability Saviorism

**Intersectional:** Inspiration Porn, Superhumanization, Tokenism

### Key Results
- 99.7% of conversations with disabled candidates contained at least one ABLEIST harm
- Harms compound intersectionally (disability + marginalized gender + caste → 10-51% more harm)
- ALL existing safety tools (Perspective API, OpenAI Moderation, Azure Safety, Detoxify) failed to detect any harm
- Fine-tuned Llama-3.1-8B-Instruct achieves F1 = 0.75-0.94 for detection
- Open-source code and model available

### Application to PlacedOn
- ABLEIST metrics as our bias checking framework
- Integrated at every state contraction during interviews
- Distilled detection model for scalable checking
- Regulatory compliance feature (NYC LL144, EU AI Act)
- Competitive differentiator vs. tools that ignore intersectional bias
