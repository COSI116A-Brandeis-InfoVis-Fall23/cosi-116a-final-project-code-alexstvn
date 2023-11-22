import pandas as pd # may have interpreter issues
import os

df = pd.read_csv(r"data\data_cleaning\MBTA Rail Ridership by Time Period, Season, Route_Line, and Stop.csv")

#DROPPING UNNECESSARY COLUMNS
columns_to_drop = ['stop_id', 'day_type_id', 'direction_id', 'mode', 'FID']
df = df.drop(columns=columns_to_drop)
# CHANGING VALUES TO BE MORE READ-ABLE
df['time_period_name'] = df['time_period_name'].str.replace('_', ' ').str.title() #replacing _ with ' ' and recapitalizing
df['day_type_name'] = df['day_type_name'].str.title() # title casing for weekday/sat/sun
df['year'] = df['season'].str.split().str[-1].astype(int) # creating a year column
df['time_period_id'] = df['time_period_id'].str.extract(r'(\d+)').astype(int) # only obtaining integer for id

#RE-CAPITALIZING COLUMN NAMES
df.columns = [col.replace('_', ' ').title() for col in df.columns]

#EXPORTING DATAFRAME
directory = "data"
file_name_csv = "MBTA_Data.csv"
file_name_json = "MBTA_Data.json"
# export as csv
file_path = os.path.join(directory, file_name_csv)
df.to_csv(file_path, index=False)
#export as json
file_path = os.path.join(directory, file_name_json)
df.to_csv(file_path, index=False)