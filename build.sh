#! /bin/sh

# Clear
rm -rf bin
rm -rf deliverables

# Prepare
mkdir -p deliverables/Standard/4.6.0/

# Complie
ant -buildfile build.xml

# Package
java -jar build\dependency\rapc.jar -convertpng codename=deliverables\Standard\4.6.0\devTracBB -sourceroot=src -import=lib\net_rim_api.jar build\dependency\devTracBB.rapc bin

