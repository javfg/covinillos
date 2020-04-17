#!/usr/bin/env python3.8

from datetime import datetime
import json

import pandas as pd


coord_cols = ["Lat", "Long"]
location_cols = ["Province/State", "Country/Region"]

covid_root_path = "/home/javilol/learn/d3/covid"
covid_timeseries_path = f"{covid_root_path}/COVID-19/csse_covid_19_data/csse_covid_19_time_series/"


def fix_data(df, original_date_format):
    # remove coordinates columns
    df = df.drop(coord_cols, axis=1)

    # get columns with values
    data_cols = [x for x in df.columns if x not in location_cols]

    # fill zeros and convert to int in data columns
    df[df.columns[~df.columns.isin(location_cols)]] = df[df.columns[~df.columns.isin(location_cols)]].fillna(0).astype(int)

    # convert dates to ISO6801
    column_names = location_cols + [str(datetime.strptime(date, original_date_format).date()) for date in data_cols]
    df.columns = column_names

    return df


def aggregate_countries(df):
    return df.groupby("Country/Region").sum()


def sort_descending(df, col):
    return df.sort_values(by=col, ascending=False)


confirmed_total = f"{covid_timeseries_path}time_series_covid19_confirmed_global.csv"
confirmed_total = aggregate_countries(fix_data(pd.read_csv(confirmed_total, sep=","), "%m/%d/%y"))
confirmed_total = sort_descending(confirmed_total, confirmed_total.columns[-1])
confirmed_daily = confirmed_total.diff(axis=1).fillna(confirmed_total).clip(lower=0).astype(int)

country_order = list(confirmed_total.index.values)

deaths_total = f"{covid_timeseries_path}time_series_covid19_deaths_global.csv"
deaths_total = aggregate_countries(fix_data(pd.read_csv(deaths_total, sep=","), "%m/%d/%y"))
deaths_total = deaths_total.loc[country_order]
deaths_daily = deaths_total.diff(axis=1).fillna(deaths_total).clip(lower=0).astype(int)

recovered_total = f"{covid_timeseries_path}time_series_covid19_recovered_global.csv"
recovered_total = aggregate_countries(fix_data(pd.read_csv(recovered_total, sep=","), "%m/%d/%y"))
recovered_total = recovered_total.loc[country_order]
recovered_daily = recovered_total.diff(axis=1).fillna(recovered_total).clip(lower=0).astype(int)


events = pd.read_csv(f"{covid_root_path}/events.csv", skip_blank_lines=True)

dataset = {}

for country in country_order:
    dataset[country] = []

    for date in confirmed_total.columns:
        dataset[country].append({
            'date': date,
            'confirmed_total': int(confirmed_total.loc[country, date]),
            'deaths_total': int(deaths_total.loc[country, date]),
            'recovered_total': int(recovered_total.loc[country, date]),
            'confirmed_daily': int(confirmed_daily.loc[country, date]),
            'deaths_daily': int(deaths_daily.loc[country, date]),
            'recovered_daily': int(recovered_daily.loc[country, date]),
            'events': events.loc[(events.country == country) & (events.date == date)][['description', 'group', 'reference']].to_dict(orient="records")
        })

with open(f"{covid_root_path}/covinillos/data/dataset.json", "w") as data_file:
    json.dump(dataset, data_file)


events_dict = events.to_dict(orient="records")

with open(f"{covid_root_path}/covinillos/data/events.json", "w") as events_file:
    json.dump(events_dict, events_file)