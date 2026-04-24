import json
import logging
import math
import random
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Tuple

logging.basicConfig(level=logging.INFO, format="%(message)s")

SKILLS = ["caching", "concurrency", "api_design", "system_design"]
DIFFICULTIES = ["easy", "medium", "hard"]
FRAMEWORKS = ["direct_recall", "scenario_code", "architectural_tradeoff"]

class QuestionImproverEnv:
    """Simulates an interview candidate reacting to different prompt frameworks."""
    def __init__(self, target_competence: Dict[str, float]):
        self.target_competence = target_competence
        self.reset()

    def reset(self):
        self.turn = 0
        self.state_vector = {s: 0.5 for s in SKILLS}
        self.state_sigma2 = {s: 0.95 for s in SKILLS}
        return self._get_obs()

    def _get_obs(self) -> str:
        # Heavily quantized bins for fast tabular convergence
        # 0: <0.2 (Clear), 1: 0.2-0.5 (Mild), 2: >0.5 (Uncertain)
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
        self.turn += 1
        
        # Decode action
        d_len = len(DIFFICULTIES)
        f_len = len(FRAMEWORKS)
        
        skill_idx = action_idx // (d_len * f_len)
        remainder = action_idx % (d_len * f_len)
        diff_idx = remainder // f_len
        framework_idx = remainder % f_len
        
        skill = SKILLS[skill_idx]
        diff = DIFFICULTIES[diff_idx]
        framework = FRAMEWORKS[framework_idx]

        actual_comp = self.target_competence[skill]
        p_prior = self.state_sigma2[skill]
        current_score = self.state_vector[skill]
        
        # Engine: Framework interacts with Candidate Competence
        base_noise = 0.2
        simulated_score = actual_comp
        signal_quality = 1.0  # 1.0 = clear signal, 0.0 = terrible signal noise

        if framework == "direct_recall":
            if actual_comp > 0.6:
                # Strong engineers pass recall instantly, but we learn NOTHING about depth
                signal_quality = 0.2 
                simulated_score = 0.8
            else:
                # Weak engineers fail recall, clear negative signal
                signal_quality = 0.9
                simulated_score = 0.1
                
        elif framework == "scenario_code":
            if actual_comp > 0.4:
                # Yields very clean measurement across the spectrum
                signal_quality = 0.9
                simulated_score = actual_comp + random.uniform(-0.1, 0.1)
            else:
                # Overwhelms weak engineers instantly
                signal_quality = 0.95
                simulated_score = 0.0
                
        elif framework == "architectural_tradeoff":
            if actual_comp > 0.8:
                # The ONLY way to distinguish 0.8 from 0.99 cleanly
                signal_quality = 1.0 
                simulated_score = actual_comp
            elif actual_comp > 0.5:
                # Medium engineers stumble
                signal_quality = 0.7
                simulated_score = actual_comp - 0.2
            else:
                # Weak engineers give zero signal (pure rambling noise)
                signal_quality = 0.1 
                simulated_score = random.uniform(0.1, 0.8) # Rambling BS

        # Added Difficulty factor
        if diff == "hard":
            simulated_score *= 0.8

        # Reward formulation
        reward = -0.5 # Default cost per turn
        if p_prior > 0.2:
            reward = 0.5 # Exploring an unknown is good

        # Kalman mock update using Signal Quality mapping to Measurement Noise (R)
        r = base_noise / max(0.01, signal_quality)
        p_predicted = p_prior + 0.05
        k = p_predicted / (p_predicted + r)

        self.state_vector[skill] = current_score + k * (simulated_score - current_score)
        self.state_vector[skill] = max(0.0, min(1.0, self.state_vector[skill]))
        self.state_sigma2[skill] = (1.0 - k) * p_predicted

        converged = all(v < 0.25 for v in self.state_sigma2.values())
        done = converged or self.turn >= 20
        
        if converged:
            reward += 20.0
            
        return self._get_obs(), reward, done

class QLearningMetaAgent:
    def __init__(self):
        self.q_table: Dict[str, List[float]] = {}
        self.num_actions = len(SKILLS) * len(DIFFICULTIES) * len(FRAMEWORKS)
        self.alpha = 0.1
        self.gamma = 0.95
        self.epsilon = 1.0
        self.epsilon_decay = 0.998
        self.min_epsilon = 0.05

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

def run_meta_simulation(episodes: int = 15000):
    logging.info("Initializing Meta-Learning Question Improver Simulation...")
    logging.info(f"Training for {episodes} episodes over {len(SKILLS)} skills, {len(DIFFICULTIES)} difficulties, and {len(FRAMEWORKS)} Frameworks.")
    
    agent = QLearningMetaAgent()
    rewards_history = []
    turns_history = []
    
    for episode in range(episodes):
        # Mix of Junior, Mid, and Senior templates
        comp_profile = random.choice([
            (0.1, 0.4), # Junior
            (0.4, 0.7), # Mid
            (0.7, 0.99) # Senior
        ])
        target = {s: random.uniform(comp_profile[0], comp_profile[1]) for s in SKILLS}
        env = QuestionImproverEnv(target)
        
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
        
        if (episode + 1) % 1500 == 0:
            avg_reward = sum(rewards_history[-1500:]) / 1500
            avg_turns = sum(turns_history[-1500:]) / 1500
            logging.info(f"Episode {episode + 1:5d} | Avg Reward: {avg_reward:6.2f} | Avg Turns to Converge: {avg_turns:5.2f} | Epsilon: {agent.epsilon:.3f}")

    logging.info("\\nTraining complete! Running Live Validation...")
    
    # Test on a Senior Candidate
    logging.info("\\n--- Test Interrogation: Senior Architecture Profile ---")
    test_target = {"caching": 0.9, "concurrency": 0.85, "api_design": 0.95, "system_design": 0.92}
    env = QuestionImproverEnv(test_target)
    state = env.reset()
    done = False
    
    agent.epsilon = 0.0
    while not done:
        action = agent.choose_action(state)
        skill_idx = action // (len(DIFFICULTIES) * len(FRAMEWORKS))
        remainder = action % (len(DIFFICULTIES) * len(FRAMEWORKS))
        diff_idx = remainder // len(FRAMEWORKS)
        framework_idx = remainder % len(FRAMEWORKS)
        
        logging.info(f"Turn {env.turn+1:2d} -> Model asks [{SKILLS[skill_idx]}] at [{DIFFICULTIES[diff_idx]}] using format [{FRAMEWORKS[framework_idx].upper()}]")
        state, reward, done = env.step(action)

    logging.info(f"Simulation completed in {env.turn} turns.")

    # Save Meta Policy
    out_path = Path("training/rl_question_improver_policy.json")
    out_path.write_text(json.dumps(agent.q_table, indent=2))
    logging.info(f"Saved Question Improver Policy to {out_path}")

if __name__ == "__main__":
    run_meta_simulation()
