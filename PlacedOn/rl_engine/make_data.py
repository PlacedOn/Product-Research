import pandas as pd
import numpy as np

def make_historical_data():
    n_rows = 100000
    print(f"--- GENERATING {n_rows} ROWS OF HISTORICAL DATA ---")
    
    # Generate random features
    accuracy = np.random.uniform(0.0, 1.0, n_rows)
    time_taken = np.random.uniform(5.0, 60.0, n_rows)
    confidence = np.random.uniform(0.0, 1.0, n_rows)
    
    # Core Logic: If accuracy > 0.8 and time_taken < 25.0 -> Hired (1)
    actual_score = ((accuracy > 0.8) & (time_taken < 25.0)).astype(int)
    
    # Add 5% Noise (flip scores)
    noise_idx = np.random.choice(n_rows, size=int(n_rows * 0.05), replace=False)
    actual_score[noise_idx] = 1 - actual_score[noise_idx]
    
    # Create DataFrame
    df = pd.DataFrame({
        'accuracy': accuracy,
        'time_taken': time_taken,
        'confidence': confidence,
        'actual_score': actual_score
    })
    
    # Save to CSV
    filename = 'historical_interviews.csv'
    df.to_csv(filename, index=False)
    print(f"✅ SUCCESS: {filename} generated in the current directory.")
    print(f"Outcome Distribution: {df['actual_score'].value_counts().to_dict()}")

if __name__ == "__main__":
    make_historical_data()
