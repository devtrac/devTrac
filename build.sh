#! /bin/sh

set -e

# Test
sh ./build/spec

# Clear
rm -rf bin
rm -rf deliverables

# Prepare
mkdir -p deliverables/Standard/4.6.0/

# Complie
ant -buildfile build.xml

# Package
java -jar build/dependency/rapc.jar -convertpng codename=deliverables/Standard/4.6.0/devTracBB -sourceroot=src -import=lib/net_rim_api.jar build/dependency/devTracBB.rapc bin

# Sign
java -jar build/dependency/SignatureTool.jar -a -C -p r0ys1ngh4m deliverables/Standard/4.6.0/devTracBB.cod

# Post build
cp build/dependency/devTracBB.alx deliverables/Standard/
