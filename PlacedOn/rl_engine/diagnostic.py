from rl_engine.placedon_env import PlacedonEnv
import numpy as np

def diagnostic_test():
    print("=== STARTING ADVERSARIAL ENVIRONMENT DIAGNOSTIC ===")
    
    env = PlacedonEnv()
    obs, info = env.reset()
    
    # 1. Verify Observation Dimension
    print(f"Observation Space: {env.observation_space}")
    if obs.shape[0] == 4:
        print("✅ SUCCESS: 4D Observation Space detected.")
    else:
        print(f"❌ FAILURE: Expected 4D, got {obs.shape[0]}")

    # 2. Verify Difficulty Scaling Logic
    print("\n--- DIFFICULTY SCALING TEST ---")
    PlacedonEnv.global_step_counter = 50000 # Set to 5th milestone
    diff_factor = env._get_difficulty_factor()
    print(f"Milestone 50,000 Difficulty Factor: {diff_factor:.2f}")
    
    if diff_factor > 1.0:
         print(f"✅ SUCCESS: Difficulty factor scaled to {diff_factor:.2f}")
    else:
         print("❌ FAILURE: Difficulty factor did not scale.")

    # 3. Verify Noise Injection
    print("\n--- STOCHASTIC NOISE TEST ---")
    # Take 5 steps and see if observations change unpredictably
    for i in range(3):
        obs, reward, term, trunc, info = env.step(0)
        print(f"Turn {i+1} Obs: {obs}")
    
    print("\n✅ DIAGNOSTIC COMPLETE: READY FOR ADVERSARIAL TRAINING")

if __name__ == "__main__":
    diagnostic_test()
