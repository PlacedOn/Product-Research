from rl_engine.placedon_env import PlacedonEnv
import pandas as pd
import numpy as np

def dataset_diagnostic():
    print("=== STARTING DATASET-DRIVEN ENVIRONMENT DIAGNOSTIC ===")
    
    # 1. Initialize Env
    try:
        env = PlacedonEnv()
        print("✅ SUCCESS: Environment initialized and CSV loaded.")
    except Exception as e:
        print(f"❌ FAILURE: Could not load environment: {e}")
        return

    # 2. Test Reset (Sampling)
    obs, info = env.reset()
    print(f"Sampled Candidate State: {obs}")
    
    if len(obs) == 3:
        print("✅ SUCCESS: 3D Dataset-Driven Observation Space detected.")
    else:
        print(f"❌ FAILURE: Expected 3D, got {len(obs)}")

    # 3. Test Reward Logic
    # We know actual_score is 0 or 1.
    actual = int(env.current_row['actual_score'])
    print(f"Historical Outcome for this row: {actual}")
    
    # Try a matching action
    _, reward_match, _, _, _ = env.step(actual)
    print(f"Reward for Action={actual}: {reward_match}")
    
    # Try a non-matching action
    env.reset() # Reset to get a new (or same) row
    wrong_action = 1 - actual
    _, reward_miss, _, _, _ = env.step(wrong_action)
    print(f"Reward for Action={wrong_action}: {reward_miss}")

    if reward_match == 50.0 and reward_miss == -50.0:
        print("✅ SUCCESS: Match/Miss reward logic confirmed.")
    else:
        print("❌ FAILURE: Reward logic mismatch.")

    print("\n✅ DIAGNOSTIC COMPLETE: READY FOR DATASET-DRIVEN TRAINING")

if __name__ == "__main__":
    dataset_diagnostic()
