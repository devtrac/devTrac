#! /bin/sh

set -e

# Build
ant -buildfile build.xml

# Package
package_log="/tmp/package.log.$$"

java -jar build/dependency/rapc.jar -convertpng codename=deliverables/Standard/4.6.0/devTracBB -sourceroot=src/main -import=lib/net_rim_api.jar build/dependency/devTracBB.rapc bin/main | tee "$package_log"
tail -n 1 "$package_log" | grep 'No errors.' &> /dev/null 

rm "$package_log"

# Sign
sign_log="/tmp/sign.log.$$"

java -jar build/dependency/SignatureTool.jar -a -C -p r0ys1ngh4m deliverables/Standard/4.6.0/devTracBB.cod | tee "$sign_log"
tail -n 1 "$sign_log" | grep 'Success.' &> /dev/null 

rm "$sign_log"

