#! /bin/sh

set -e

ant_log="ant.log.$$"

# Build
ant -buildfile build.xml sign | tee "$ant_log"

# Check package result
cat "$ant_log" | grep 'No errors.' &> /dev/null

# Check sign result
cat "$ant_log" | grep 'Success.' &> /dev/null

# Clean
rm "$ant_log"

