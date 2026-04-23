import pandas as pd
import numpy as np
import requests
import os

def integrate_external_hr_data():
    url = "https://raw.githubusercontent.com/pouyasattari/HR-Dataset-Analysis/main/HRDataset_v14.csv"
    local_raw = "external_hr_data.csv"
    master_csv = "historical_interviews.csv"

    print("--- EXTERNAL HR DATA INTEGRATION: KAGGE HUB ---")
    
    # 1. Download Data
    print(f"Downloading dataset from GitHub...")
    response = requests.get(url)
    with open(local_raw, "wb") as f:
        f.write(response.content)
    
    # 2. Load and Clean
    df_raw = pd.read_csv(local_raw)
    print(f"Loaded {len(df_raw)} records from external dataset.")
    
    # 3. Mapping to Placedon Space
    # PerfScoreID: 4=Exceeds, 3=Fully Meets, 2=Needs Imp, 1=PIP
    df_clean = pd.DataFrame()
    
    # Map Accuracy from Performance
    perf_map = {4: 0.95, 3: 0.8, 2: 0.5, 1: 0.2}
    df_clean['accuracy'] = df_raw['PerfScoreID'].map(perf_map).fillna(0.7)
    
    # Map Confidence from EngagementSurvey (1.0 to 5.0 scale)
    df_clean['confidence'] = df_raw['EngagementSurvey'] / 5.0
    
    # Synthesize Time Taken based on SpecialProjects and Absences
    # More projects = likely more efficient/engaged candidate (simulated)
    # More absences = slower/less reliable
    df_clean['time_taken'] = np.clip(30 - (df_raw['SpecialProjectsCount'] * 2) + df_raw['Absences'], 5.0, 60.0)
    
    # Define Target Score (Hired)
    # A 'Gold Standard' hire in this dataset is someone who 'Matches' or 'Exceeds' and was NOT terminated
    df_clean['actual_score'] = ((df_raw['PerfScoreID'] >= 3) & (df_raw['Termd'] == 0)).astype(int)
    
    print("--- MAPPING COMPLETE: INTEGRATING WITH MASTER DATASET ---")
    
    # 4. Integrate with Repository
    if os.path.exists(master_csv):
        df_master = pd.read_csv(master_csv)
        df_final = pd.concat([df_master, df_clean], ignore_index=True)
        print(f"Appended {len(df_clean)} real-world samples to {master_csv}.")
    else:
        df_final = df_clean
        print(f"Created new {master_csv} with {len(df_clean)} real-world samples.")
        
    df_final.to_csv(master_csv, index=False)
    print(f"✅ SUCCESS: Master Dataset synchronized. Total Rows: {len(df_final)}")

if __name__ == "__main__":
    integrate_external_hr_data()
