import pandas as pd
import os

df = pd.read_csv(r"data\MBTA Rail Ridership by Time Period, Season, Route_Line, and Stop.csv")

#dropping columns
columns_to_drop = ['stop_id', 'day_type_id', 'direction_id', 'mode', 'FID']
df = df.drop(columns=columns_to_drop)

df['time_period_name'] = df['time_period_name'].str.replace('_', ' ').str.title()
df['day_type_name'] = df['day_type_name'].str.title()
df['year'] = df['season'].str.split().str[-1].astype(int)
df['time_period_id'] = df['time_period_id'].str.extract(r'(\d+)').astype(int)

df.columns = [col.replace('_', ' ').title() for col in df.columns]

directory = "data"
file_name = "MBTA_Data.csv"
file_path = os.path.join(directory, file_name)
df.to_csv(file_path, index=False)