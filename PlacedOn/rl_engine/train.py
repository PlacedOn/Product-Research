from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import CheckpointCallback
from rl_engine.placedon_env import PlacedonEnv
import os

def train():
    # Infrastructure: Ensure logs directory exists
    os.makedirs("./logs/", exist_ok=True)
    
    # Instantiate the environment (Automatically uses Mac CPU)
    env = PlacedonEnv()
    
    model_path = "placedon_v1.zip"
    
    # Persistent Loading Logic with Architecture Check
    if os.path.exists(model_path):
        try:
            print(f"--- DETECTED EXISTING BRAIN: ATTEMPTING TO LOAD {model_path} ---")
            # Load and ensure it uses CPU device
            model = PPO.load("placedon_v1", env=env, device="cpu")
            print("--- LOAD SUCCESSFUL: RESUMING EVOLUTION ---")
        except Exception as e:
            print(f"--- ARCHITECTURE MISMATCH OR CORRUPTION ({str(e)}): INITIALIZING FRESH BRAIN ---")
            model = PPO("MlpPolicy", env, verbose=1, device="cpu")
    else:
        print("--- NO EXISTING BRAIN FOUND: INITIALIZING NEW PPO MODEL ---")
        model = PPO("MlpPolicy", env, verbose=1, device="cpu")
    
    # Task 2: 60,000,000 Timestep Marathon Configuration
    # Save every 1,000,000 steps
    checkpoint_callback = CheckpointCallback(
        save_freq=1000000, 
        save_path="./logs/",
        name_prefix="placedon_marathon"
    )
    
    print("--- STARTING 60,000,000 STEP MASTER MARATHON ---")
    
    try:
        # Train with continuous learning blocks
        model.learn(
            total_timesteps=60000000, 
            callback=checkpoint_callback,
            reset_num_timesteps=False 
        )
        
        # Final Save
        print("\n--- MARATHON COMPLETE: SAVING SENIOR MODEL ---")
        model.save("placedon_v1_senior")
        model.save("placedon_v1") # Also overwrite primary for persistence
        print("Brain successfully evolved to Senior level.")
            
    except KeyboardInterrupt:
        print("\n--- MARATHON SUSPENDED BY USER ---")
        model.save("placedon_v1")
        print("Safety save completed.")

if __name__ == "__main__":
    train()
