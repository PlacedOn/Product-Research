import pandas as pd
import numpy as np

def generate_historical_data(filename='historical_interviews.csv', n_rows=1000000):
    print(f"--- GENERATING {n_rows} ROWS OF DEEPMIND-SCALE ARCHETYPE DATA ---")
    
    # Define Archetype Profiles
    # [Accuracy Range, Time Range, Confidence Range, Base Hire Result]
    archetypes = {
        0: {"name": "Rockstar", "acc": (0.85, 1.0), "time": (10, 25), "conf": (0.8, 1.0), "target": 1},
        1: {"name": "Bluffer",  "acc": (0.1, 0.4),  "time": (5, 15),  "conf": (0.9, 1.0), "target": 0},
        2: {"name": "Grinder",  "acc": (0.6, 0.8),  "time": (40, 60), "conf": (0.7, 0.9), "target": 0},
        3: {"name": "Silent Genius", "acc": (0.9, 1.0), "time": (10, 20), "conf": (0.1, 0.4), "target": 1},
        4: {"name": "Mid-Level", "acc": (0.5, 0.7), "time": (25, 45), "conf": (0.4, 0.7), "target": 0},
    }

    rows_per_archetype = n_rows // len(archetypes)
    data = []

    for arch_id, profile in archetypes.items():
        print(f"Synthesizing {rows_per_archetype} rows for: {profile['name']}")
        
        acc = np.random.uniform(profile['acc'][0], profile['acc'][1], rows_per_archetype)
        time = np.random.uniform(profile['time'][0], profile['time'][1], rows_per_archetype)
        conf = np.random.uniform(profile['conf'][0], profile['conf'][1], rows_per_archetype)
        
        # Add slight noise to target scores within archetypes
        target = np.full(rows_per_archetype, profile['target'])
        noise_idx = np.random.choice(rows_per_archetype, size=int(rows_per_archetype * 0.02), replace=False)
        target[noise_idx] = 1 - target[noise_idx]
        
        # Add data to master list
        arch_df = pd.DataFrame({
            'accuracy': acc,
            'time_taken': time,
            'confidence': conf,
            'archetype_id': arch_id,
            'actual_score': target
        })
        data.append(arch_df)

    # 5. Final Merge & Shuffle
    df = pd.concat(data, ignore_index=True)
    df = df.sample(frac=1).reset_index(drop=True)
    
    # Save to CSV
    df.to_csv(filename, index=False)
    print(f"✅ SUCCESS: Dataset saved to {filename} ({len(df)} rows)")
    print(f"Target Distribution: {df['actual_score'].value_counts().to_dict()}")

if __name__ == "__main__":
    generate_historical_data()
