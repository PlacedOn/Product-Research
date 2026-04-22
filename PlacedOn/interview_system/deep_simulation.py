from __future__ import annotations
import asyncio
import logging
from aot_layer.config import AoTConfig
from aot_layer.models import StartInput
from interview_system.orchestrator import FullStackInterviewOrchestrator

# Setup logging to see the CTO-level internal calculations
logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

async def deep_simulation():
    """
    CTO-Level High-Fidelity Simulation.
    Induces a 'Consistency Anomaly' to test the DAG and Consensus Judge.
    """
    logger.info("=== STARTING DEEP CTO SIMURATION: CONSISTENCY ANOMALY TEST ===")
    
    # 1. Setup Architecture with target dependencies
    # block_4_grit -> block_5_resilience (DAG)
    # backend + db_design -> system_design (DAG)
    skills = ["block_4_grit", "block_5_resilience", "backend", "db_design", "system_design"]
    config = AoTConfig(skills=skills)
    orchestrator = FullStackInterviewOrchestrator(config=config)
    
    # Starting state: high uncertainty
    start = StartInput(
        skill_vector=[0.5] * len(skills),
        sigma2=[0.8] * len(skills),
        past_attempts_per_skill={s: 0 for s in skills},
    )

    # 2. Define scripted Answer Provider with a CONTRADICTION
    # Turn 1: Grit (Excellent)
    # Turn 2: Resilience (Tied to Grit)
    # Turn 3: System Design (Contradicts prior technical claims)
    
    async def scripted_answer_provider(turn, question, skill, mode):
        logger.info(f"TURN {turn} | SKILL: {skill} | MODE: {mode}")
        logger.info(f"QUESTION: {question}")
        
        if skill == "block_4_grit":
            return "I have high grit. I stayed up for 72 hours to fix a production bug in Redis."
        
        if skill == "block_5_resilience":
            # Ties to Grit
            return "When the system failed, I stayed calm and systematically checked logs, as I am used to high-pressure fixes."
            
        if skill == "system_design":
            # SHARP CONTRADICTION: Claims to be an expert then gives a wrong/shallow answer
            # This should trigger the Consensus Judge DRIFT check.
            return "System design is easy, you just put everything in one database and hope it scales. I don't believe in distributed systems."
            
        if skill == "backend":
             return "I build robust APIs with Python and ensure they are well-tested."
             
        if skill == "db_design":
             return "I use PostgreSQL and ensure proper indexing for fast queries."

        return "I am a versatile engineer with broad interests."

    # 3. Run Simulation
    result = await orchestrator.run(
        candidate_id="deep-sim-cand-001",
        start_input=start,
        answer_provider=scripted_answer_provider,
        max_turns=6
    )

    # 4. Verify Calculations
    logger.info("=== SIMULATION COMPLETE ===")
    logger.info(f"Final Candidate Fit Score: {result.fit.fit_score}")
    
    # Audit DAG Routing
    turns_taken = [t.skill for t in result.turns]
    logger.info(f"Skill Sequence: {turns_taken}")
    
    # Look for the Drift Penalties
    for t in result.turns:
        if t.drift_score > 0:
            logger.info(f"DRIFT DETECTED IN TURN {t.turn} (Skill: {t.skill})! Score: {t.drift_score}")
            logger.info(f"Consensus Best Match: {t.best_match}")
            
    # Verify DAG dependency ordering
    # Check if system_design came after backend and db_design
    try:
        idx_sys = turns_taken.index("system_design")
        idx_back = turns_taken.index("backend")
        idx_db = turns_taken.index("db_design")
        if idx_sys > idx_back and idx_sys > idx_db:
            logger.info("✅ DAG Validation Passed: System Design assessed AFTER prerequisites.")
        else:
             logger.warning("❌ DAG Validation Failed: Skills assessed out of order.")
    except ValueError:
        logger.info("System Design was not reached, DAG logic may have pivoted away.")

if __name__ == "__main__":
    asyncio.run(deep_simulation())
