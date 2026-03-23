import pandas as pd
import json
from urllib.parse import urlparse

# Load the three TSVs
dark_patterns = pd.read_csv('dark_patterns.tsv', sep='\t')
dialogs = pd.read_csv('dialogs.tsv', sep='\t')
clickables = pd.read_csv('clickables.tsv', sep='\t')

dataset = {}

# Process dark patterns per domain
for domain, group in dark_patterns.groupby('domain'):
    patterns = {}
    clicks = None
    for _, row in group.iterrows():
        if row['type'] == 'number of clicks to reject cookies':
            clicks = int(row['value']) if str(row['value']).isdigit() else 0
        elif row['value'] == 'True':
            patterns[row['type']] = True
    
    dataset[domain] = {
        'patterns': patterns,
        'clicks_to_reject': clicks,
        'severity': 'high' if len(patterns) >= 3 else 'medium' if len(patterns) >= 1 else 'none'
    }

# # Add dialog selectors from dialogs.tsv
# for _, row in dialogs.iterrows():
#     domain = row['domain']
#     if domain in dataset:
#         dataset[domain]['dialog_selector'] = row['css_selector']

# # Add clickable types from clickables.tsv
# for domain, group in clickables.groupby('domain'):
#     if domain in dataset:
#         dataset[domain]['clickables'] = [
#             {'type': row['type'], 'selector': row['css_selector'], 'text': row['text']}
#             for _, row in group.iterrows()
#             if row['type'] != 'Untagged'
#         ]

with open('dataset.json', 'w') as f:
    json.dump(dataset, f, indent=2)

print(f"Built dataset for {len(dataset)} domains")