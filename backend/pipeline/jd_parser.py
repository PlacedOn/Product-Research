SKILL_MAP = {
    "redis": "caching",
    "cache": "caching",
    "caching": "caching",
    "api": "backend",
    "rest": "backend",
    "database": "db_design",
    "sql": "db_design",
    "scaling": "system_design",
    "microservices": "system_design",
}

ROLE_TEMPLATES = {
    "backend": ["backend", "db_design", "caching", "system_design"],
    "frontend": ["frontend", "ui", "performance"],
}


def extract_skills_from_jd(jd_text: str) -> dict[str, int]:
    normalized_text = str(jd_text or "").lower()
    skills: dict[str, int] = {}

    for keyword, skill in SKILL_MAP.items():
        if keyword in normalized_text:
            skills[skill] = skills.get(skill, 0) + 1

    return skills


def normalize_skills(skills: dict[str, int]) -> dict[str, float]:
    total = sum(skills.values()) or 1
    return {name: (value / total) for name, value in skills.items()}


def build_skill_profile(jd_text: str, role: str) -> dict[str, float]:
    extracted = extract_skills_from_jd(jd_text)
    normalized = normalize_skills(extracted)

    base = ROLE_TEMPLATES.get(str(role or "").strip().lower(), [])
    for skill in base:
        if skill not in normalized:
            normalized[skill] = 0.3

    return normalized