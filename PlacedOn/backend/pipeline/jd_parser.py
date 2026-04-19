from skill_taxonomy import JD_SKILL_MAP, role_defaults


def extract_skills_from_jd(jd_text: str) -> dict[str, int]:
    normalized_text = str(jd_text or "").lower()
    skills: dict[str, int] = {}

    for keyword, skill in JD_SKILL_MAP.items():
        if keyword in normalized_text:
            skills[skill] = skills.get(skill, 0) + 1

    return skills


def normalize_skills(skills: dict[str, int]) -> dict[str, float]:
    total = sum(skills.values()) or 1
    return {name: (value / total) for name, value in skills.items()}


def build_skill_profile(jd_text: str, role: str) -> dict[str, float]:
    extracted = extract_skills_from_jd(jd_text)
    normalized = normalize_skills(extracted)

    base = role_defaults(role)
    for skill in base:
        if skill not in normalized:
            normalized[skill] = 0.15

    return normalized
