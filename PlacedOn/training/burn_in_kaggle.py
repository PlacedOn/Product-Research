from __future__ import annotations
import asyncio
import csv
import logging
from backend.llm.judge import evaluate_answer

# Setup logging for the training 'Burn-In' process
logging.basicConfig(level=logging.INFO, format="[BURN-IN] %(message)s")
logger = logging.getLogger(__name__)

async def burn_in_kaggle_training():
    """
    Automated Training Validation.
    Runs the 'Judge' against real-world Kaggle data to verify calibration.
    """
    logger.info("=== STARTING KAGGE-DRIVEN BURN-IN TRAINING ===")
    
    gold_path = "/Users/nishantsingh/Desktop/Placedon/Product-Research/PlacedOn/training/real_world_gold.csv"
    
    results = []
    with open(gold_path, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            question = row["question"]
            answer = row["answer"]
            expected_score = float(row["quality_score"])
            
            logger.info(f"Testing Turn: {row['skill']} | Expected Score: {expected_score}")
            
            # Run the newly calibrated judge (uses few-shot Gold data internally)
            ai_output = await evaluate_answer(question, answer)
            
            delta = abs(ai_output.score - expected_score)
            results.append({
                "skill": row["skill"],
                "expected": expected_score,
                "ai": ai_output.score,
                "delta": round(delta, 3),
                "intent": ai_output.intent
            })
            
            logger.info(f"  AI Score: {ai_output.score} | Delta: {round(delta, 3)}")
            if delta > 0.3:
                logger.warning(f"  High Variance Detected! Logic may need further hardening for: {row['skill']}")

    # Final Analytics
    avg_delta = sum(r["delta"] for r in results) / len(results)
    logger.info("=== BURN-IN COMPLETE ===")
    logger.info(f"Average Delta from Real-World Ground Truth: {round(avg_delta, 4)}")
    
    if avg_delta <= 0.25:
        logger.info("✅ Training Successful: AI is within acceptable variance of real-world problems.")
    else:
        logger.warning("❌ Training Partial: Variance still too high. Adjust few-shot weights.")

if __name__ == "__main__":
    asyncio.run(burn_in_kaggle_training())
