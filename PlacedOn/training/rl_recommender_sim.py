import json
import logging
import math
import random
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

# We define the states heavily binned so the tabular Q-learning can converge fast
SKILLS = ["caching", "concurrency", "api_design", "system_design"]
DIFFICULTIES = ["easy", "medium", "hard"]

logging.basicConfig(level=logging.INFO, format="%(message)s")


class RecoEnvironment:
    """Simulates an interview candidate reacting to orchestrator choices."""
    def __init__(self, target_competence: Dict[str, float]):
        self.target_competence = target_competence
        self.reset()

    def reset(self):
        self.turn = 0
        self.state_vector = {s: 0.5 for s in SKILLS}
        self.state_sigma2 = {s: 0.95 for s in SKILLS}
        self.history = []
        return self._get_obs()

    def _get_obs(self) -> str:
        # Discretize state for tabular Q-learning: Only keep track of sigma2 bins
        # 0: <0.2, 1: <0.5, 2: >0.5
        obs = []
        for s in SKILLS:
            v = self.state_sigma2[s]
            if v < 0.2:
                obs.append("0")
            elif v < 0.5:
                obs.append("1")
            else:
                obs.append("2")
        return "".join(obs)

    def step(self, action_idx: int) -> Tuple[str, float, bool]:
        """Runs one turn of the interview simulation."""
        self.turn += 1
        
        # Decode action
        skill_idx = action_idx // len(DIFFICULTIES)
        diff_idx = action_idx % len(DIFFICULTIES)
        skill = SKILLS[skill_idx]
        diff = DIFFICULTIES[diff_idx]

        # Simulate judge result
        actual_comp = self.target_competence[skill]
        # Diff penalty: if Diff is Hard, Candidate will only answer well if comp is high
        if diff == "hard":
            simulated_score = max(0.0, actual_comp - random.uniform(0.1, 0.3))
        elif diff == "easy":
            simulated_score = min(1.0, actual_comp + random.uniform(0.1, 0.3))
        else:
            simulated_score = actual_comp + random.uniform(-0.1, 0.1)
        simulated_score = max(0.0, min(1.0, simulated_score))

        # Kalman mock update (similar to orchestrator)
        current_score = self.state_vector[skill]
        p_prior = self.state_sigma2[skill] + 0.05
        r = 0.2 # measurement noise
        
        # "Learn from mistake" - penalty if we ask a skill we already know perfectly
        reward = -0.5
        
        if p_prior > 0.2:
            reward = 1.5 # Good action: exploring an unknown skill
        
        k = p_prior / (p_prior + r)

        # "Shock": if diff is too hard and candidate fails utterly, confidence jumps
        if diff == "hard" and simulated_score < 0.2:
            k = 0.95 

        self.state_vector[skill] = current_score + k * (simulated_score - current_score)
        self.state_sigma2[skill] = (1.0 - k) * p_prior

        # Terminating condition: all sigmas < 0.25 (Convergence)
        converged = all(v < 0.25 for v in self.state_sigma2.values())
        done = converged or self.turn >= 15
        
        if converged:
            reward += 10.0 # Huge bonus for finding truth efficiently
            
        return self._get_obs(), reward, done


class QLearningRecommender:
    def __init__(self):
        self.q_table: Dict[str, List[float]] = {}
        self.alpha = 0.1
        self.gamma = 0.9
        self.epsilon = 1.0
        self.epsilon_decay = 0.995
        self.min_epsilon = 0.05
        self.num_actions = len(SKILLS) * len(DIFFICULTIES)

    def _ensure_state(self, state: str):
        if state not in self.q_table:
            self.q_table[state] = [0.0] * self.num_actions

    def choose_action(self, state: str) -> int:
        self._ensure_state(state)
        if random.uniform(0, 1) < self.epsilon:
            return random.randint(0, self.num_actions - 1)
        return self.q_table[state].index(max(self.q_table[state]))

    def learn(self, state: str, action: int, reward: float, next_state: str, done: bool):
        self._ensure_state(state)
        self._ensure_state(next_state)
        
        predict = self.q_table[state][action]
        target = reward
        if not done:
            target += self.gamma * max(self.q_table[next_state])
            
        self.q_table[state][action] += self.alpha * (target - predict)

    def decay(self):
        if self.epsilon > self.min_epsilon:
            self.epsilon *= self.epsilon_decay


def run_simulation(episodes: int = 5000):
    logging.info("Initializing DeepMind-style RL recommendation environment...")
    logging.info(f"Training for {episodes} episodes over skills {SKILLS}.")
    
    agent = QLearningRecommender()
    
    rewards_history = []
    turns_history = []
    
    for episode in range(episodes):
        # Generate random candidate ground-truth competence
        target = {s: random.uniform(0.1, 0.9) for s in SKILLS}
        env = RecoEnvironment(target)
        
        state = env.reset()
        total_reward = 0
        done = False
        
        while not done:
            action = agent.choose_action(state)
            next_state, reward, done = env.step(action)
            agent.learn(state, action, reward, next_state, done)
            state = next_state
            total_reward += reward
            
        agent.decay()
        rewards_history.append(total_reward)
        turns_history.append(env.turn)
        
        if (episode + 1) % 500 == 0:
            avg_reward = sum(rewards_history[-500:]) / 500
            avg_turns = sum(turns_history[-500:]) / 500
            logging.info(f"Episode {episode + 1:5d} | Avg Reward: {avg_reward:6.2f} | Avg Turns to Converge: {avg_turns:5.2f} | Epsilon: {agent.epsilon:.3f}")

    logging.info("\nTraining complete! The Recommendation RL Agent has learned to minimize turns by asking highly uncertain skills first.")
    
    # Run a test inference
    logging.info("\n--- Live Test Inference ---")
    test_target = {"caching": 0.8, "concurrency": 0.2, "api_design": 0.9, "system_design": 0.5}
    env = RecoEnvironment(test_target)
    state = env.reset()
    done = False
    
    agent.epsilon = 0.0 # Greedy policy
    while not done:
        action = agent.choose_action(state)
        skill_idx = action // len(DIFFICULTIES)
        diff_idx = action % len(DIFFICULTIES)
        
        logging.info(f"Turn {env.turn+1:2d} -> Orchestrator recommends polling [{SKILLS[skill_idx]}] at [{DIFFICULTIES[diff_idx]}] difficulty.")
        state, reward, done = env.step(action)
        
    logging.info(f"Simulation completed in {env.turn} turns. Final mapped uncertainties:")
    for k, v in env.state_sigma2.items():
        logging.info(f" - {k.ljust(15)}: {v:.3f}")
        
    # Save the learned policy table (Q-table)
    out_path = Path("training/rl_recommender_policy.json")
    out_path.write_text(json.dumps(agent.q_table, indent=2))
    logging.info(f"\nSaved converged RL policy array to {out_path}")


if __name__ == "__main__":
    run_simulation()
