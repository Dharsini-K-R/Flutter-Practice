#!/usr/bin/env bash

# Loop through all env vars matching the format UBIQUBE_*
# flag in the file passed as an arg (should be the index.html) with
# whatever the value of the env var is.
for variable in "${!UBIQUBE_@}"; do
    sed -i -E "s/\"\%$variable\%\"/\"${!variable}\"/" $1
done

# Finally start nginx when we're satisfied we've taken care of our
# setup tasks
nginx -g "daemon off;"
