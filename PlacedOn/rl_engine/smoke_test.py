from stable_baselines3 import PPO
from rl_engine.placedon_env import PlacedonEnv
import os
import time

def smoke_test_perpetual():
    print("=== STARTING PERPETUAL LEARNER SMOKE TEST ===")
    
    env = PlacedonEnv()
    model_path = "placedon_v1.zip"
    
    # 1. Check if model exists
    if not os.path.exists(model_path):
        print("Error: placedon_v1.zip must exist for this test.")
        return

    # Record initial modification time
    initial_time = os.path.getmtime(model_path)
    print(f"Initial model timestamp: {initial_time}")

    # 2. Simulate one 'block' of training (shortened for test)
    print("Simulating 1,000 steps of learning...")
    model = PPO.load("placedon_v1", env=env)
    model.learn(total_timesteps=1000)
    
    # 3. Simulate the auto-save logic
    print("Saving evolved brain...")
    model.save("placedon_v1")
    
    # 4. Verify timestamp change
    new_time = os.path.getmtime(model_path)
    print(f"New model timestamp: {new_time}")
    
    if new_time > initial_time:
        print("✅ SUCCESS: Primary brain was successfully evolved and overwritten.")
    else:
        print("❌ FAILURE: Model file was not updated.")

if __name__ == "__main__":
    smoke_test_perpetual()
