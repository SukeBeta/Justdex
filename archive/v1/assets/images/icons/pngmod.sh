#!/bin/bash
# By Hosuke
FILES=/Users/Hosuke/Developer/Justdex/icons/*
for f in $FILES
do
  echo "Processing $f file..."
  # take action on each file. $f store current file name
  pngout $f
done