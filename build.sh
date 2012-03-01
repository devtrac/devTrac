#! /bin/sh

set -e

# Build
ant -buildfile build.xml

# Package
java -jar build/dependency/rapc.jar -convertpng codename=deliverables/Standard/4.6.0/devTracBB -sourceroot=src/main -import=lib/net_rim_api.jar build/dependency/devTracBB.rapc bin/main

# Sign
java -jar build/dependency/SignatureTool.jar -a -C -p r0ys1ngh4m deliverables/Standard/4.6.0/devTracBB.cod

