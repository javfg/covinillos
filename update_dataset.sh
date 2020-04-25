#!/bin/bash

echo "[update dataset] fetching data"
git -C ../COVID-19 pull;

echo "[update dataset] preparing data"
/usr/bin/env python3 ../covinillos-data/data_converter.py ..

echo "[update dataset] copying data"
cp ../covinillos-data/data . -R
