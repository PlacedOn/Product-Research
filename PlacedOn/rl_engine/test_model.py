from stable_baselines3 import PPO
from rl_engine.placedon_env import PlacedonEnv
import numpy as np

def run_inference():
    # Instantiate the environment
    env = PlacedonEnv()
    
    # Load the trained model
    print("Loading PPO model: placedon_v1...")
    try:
        model = PPO.load("placedon_v1")
    except:
        print("Warning: could not load placedon_v1, using placedon_v1_senior or initializing fresh.")
        model = PPO("MlpPolicy", env, verbose=1)

    # Reset the environment
    obs, info = env.reset()
    
    print("\n" + "="*40)
    print("--- STARTING PLACEDON AI INTERVIEW ---")
    print("="*40)
    print(f"Initial Candidate Observation: [Accuracy: {obs[0]:.2f}, Time: {obs[1]:.2f}, Confidence: {obs[2]:.2f}]")
    
    terminated = False
    truncated = False
    total_reward = 0.0
    step_count = 0
    
    while not terminated and not truncated:
        step_count += 1
        
        # Get decision from the AI model (Deterministic for best strategy)
        action, _states = model.predict(obs, deterministic=True)
        
        # Process the action
        obs, reward, terminated, truncated, info = env.step(action)
        total_reward += reward
        
        # Step Report
        decision = "HIRE" if action == 1 else "REJECT"
        print(f"\n[Turn {step_count}]")
        print(f"AI Decision: {decision} ({action})")
        print(f"New Candidate Obs: [Accuracy: {obs[0]:.2f}, Time: {obs[1]:.2f}, Confidence: {obs[2]:.2f}]")
        print(f"Outcome Reward (Decision Match): {reward:.2f}")
    
    print("\n" + "="*40)
    print("--- INTERVIEW COMPLETE ---")
    print(f"Total Decisions Matched: {total_reward / 50.0} / {step_count}")
    print(f"Final Reward Sum: {total_reward}")
    print("="*40 + "\n")

if __name__ == "__main__":
    run_inference()
