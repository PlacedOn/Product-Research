import gymnasium as gym
from gymnasium import spaces
import numpy as np
import pandas as pd
import os

class PlacedonEnv(gym.Env):
    """
    Final Dataset-Driven Gymnasium Environment for Placedon.
    Optimized for continuous decision mapping against 100k+ historical records.
    """
    metadata = {"render_modes": ["human"]}

    def __init__(self, dataset_path='historical_interviews.csv'):
        super(PlacedonEnv, self).__init__()
        
        # Load Dataset
        if not os.path.exists(dataset_path):
            raise FileNotFoundError(f"Missing dataset: {dataset_path}")
            
        self.df = pd.read_csv(dataset_path)
        print(f"--- LOADED DATASET-DRIVEN ARCHITECTURE: {len(self.df)} ROWS ---")
        
        # Observation Space: [accuracy (0-1), time_taken (5-60), confidence (0-1)]
        self.observation_space = spaces.Box(
            low=np.array([0.0, 5.0, 0.0]), 
            high=np.array([1.0, 60.0, 1.0]), 
            dtype=np.float32
        )
        
        # Action Space: Decision to Hire (1) or Reject (0)
        self.action_space = spaces.Discrete(2)
        
        self.current_row = None
        self.current_step = 0
        self.max_steps = 100 # Each episode processes 100 candidates for better gradient flow

    def _get_obs(self):
        """Generates observation array from the current sampled row."""
        return np.array([
            self.current_row['accuracy'],
            self.current_row['time_taken'],
            self.current_row['confidence']
        ], dtype=np.float32)

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.current_step = 0
        
        # Sample initial candidate
        self.current_row = self.df.sample(1).iloc[0]
        
        return self._get_obs(), {}

    def step(self, action):
        self.current_step += 1
        
        # 1. Calculate Reward for the CURRENT candidate
        actual_score = int(self.current_row['actual_score'])
        
        reward = 50.0 if action == actual_score else -50.0
        
        # 2. Transition: Sample NEW candidate for the next step
        self.current_row = self.df.sample(1).iloc[0]
        new_obs = self._get_obs()
        
        # 3. Handle Termination
        terminated = self.current_step >= self.max_steps
        truncated = False
        
        return new_obs, reward, terminated, truncated, {}

    def render(self):
        pass

    def close(self):
        pass
