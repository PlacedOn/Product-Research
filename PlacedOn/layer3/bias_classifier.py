from __future__ import annotations

from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.linear_model import LogisticRegression

from layer3.config import Layer3Config
from layer3.models import BiasAssessment

_HIGH_RISK_PATTERNS = [
    "how old",
    "year were you born",
    "married",
    "relationship status",
    "pregnant",
    "children soon",
    "religion",
    "nationality",
    "parents from",
    "caste",
    "ethnic background",
    "gender identity",
    "political party",
    "disabilities",
    "medical condition",
]


class BiasEnforcer:
    def __init__(self, config: Layer3Config | None = None) -> None:
        self._config = config or Layer3Config()
        self._vectorizer = HashingVectorizer(
            n_features=self._config.classifier_features,
            alternate_sign=False,
            norm="l2",
        )
        self._model = LogisticRegression(
            random_state=self._config.classifier_random_state,
            solver="liblinear",
            max_iter=500,
        )
        self._unsafe_index = 1
        self._train()

    async def assess(self, question: str) -> BiasAssessment:
        text = (question or "").strip()
        if not text:
            return BiasAssessment(bias_score=1.0, approved=False)

        matrix = self._vectorizer.transform([text])
        probability = float(self._model.predict_proba(matrix)[0][self._unsafe_index])
        lowered = text.lower()
        if any(pattern in lowered for pattern in _HIGH_RISK_PATTERNS):
            probability = max(probability, 0.9)
        probability = round(max(0.0, min(probability, 1.0)), 4)

        return BiasAssessment(
            bias_score=probability,
            approved=probability <= self._config.bias_reject_threshold,
        )

    def _train(self) -> None:
        safe_questions = [
            "Tell me about a time you handled a difficult stakeholder conversation.",
            "Describe a situation where you had to rebuild trust after a mistake.",
            "Walk me through a time you showed ownership under pressure.",
            "How do you respond when feedback challenges your approach?",
            "Tell me about a conflict within your team and how you resolved it.",
            "Describe a setback that tested your resilience.",
            "How do you calibrate your confidence when you are unsure?",
            "Tell me about a time you had to influence without formal authority.",
            "How do you decide when to ask for help versus push through yourself?",
            "Describe a decision where you balanced speed against quality.",
            "Tell me about a project where you learned something unexpectedly.",
            "How do you adapt when priorities change late in a project?",
            "Describe a time you coached or mentored someone.",
            "How do you keep communication clear across different stakeholders?",
            "Tell me about a moment when you had to de-escalate tension on a team.",
            "Describe how you reflect after a failure or missed target.",
            "How do you make sure your work is reliable and repeatable?",
            "Tell me about a time you had to make a judgment call with incomplete data.",
            "How do you keep yourself accountable for outcomes?",
            "Describe a situation where empathy changed how you handled a problem.",
            "Explain how you would optimize cache invalidation in a distributed system.",
            "How would you design a scalable queue processing architecture?",
            "Describe trade-offs between hash maps and balanced trees.",
            "How do you approach debugging a latency issue in production?",
            "Walk through your method for reducing memory usage in a service.",
            "How would you evaluate database indexing strategy for read-heavy traffic?",
            "Explain your approach for handling retries and idempotency.",
            "How do you prioritize correctness and performance in algorithm design?",
            "Describe how you would monitor and tune system throughput.",
            "How would you communicate technical trade-offs to your team?",
        ]

        unsafe_questions = [
            "How old are you and what year were you born?",
            "Are you planning to have children soon?",
            "Which religion do you follow and does it affect your work?",
            "What is your nationality and where are your parents from?",
            "Are you married and what is your relationship status?",
            "Do you have any disabilities we should know about?",
            "What is your gender identity?",
            "Are you pregnant or planning a pregnancy?",
            "Which political party do you support?",
            "What is your caste or ethnic background?",
            "Do you have any chronic health issues that would affect attendance?",
            "Are you neurodivergent or autistic?",
            "Would your religion prevent you from working certain days?",
            "What country are you really from?",
            "Do you plan to get married soon?",
            "Who do you live with and what is your family situation?",
            "Are you taking medication for any condition?",
            "Do you identify as transgender?",
            "How much childcare support do you have at home?",
            "Would your caste create issues with this client-facing role?",
        ]

        labels = [0] * len(safe_questions) + [1] * len(unsafe_questions)
        texts = safe_questions + unsafe_questions

        features = self._vectorizer.transform(texts)
        self._model.fit(features, labels)
