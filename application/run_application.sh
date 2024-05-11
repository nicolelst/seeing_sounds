#!/bin/bash

echo "Starting seeing_sounds application..." 

# read port numbers
BE_PORT=$(python3 -c "import json; print(json.load(open('$PWD/application/port_config.json', 'r'))['be'])")
FE_PORT=$(python3 -c "import json; print(json.load(open('$PWD/application/port_config.json', 'r'))['be'])")

# run BE
echo "> Running be server in new terminal window" 
RUN_BE_CMDS="cd $PWD/application/be/endpoints && uvicorn main:app --reload --port $BE_PORT"
osascript -e "tell app \"Terminal\"
    do script \"$RUN_BE_CMDS\"
end tell"
echo ">>> Access Swagger UI at http://localhost:$BE_PORT/docs" 

# run FE
echo "> Running fe from a new terminal window" 
RUN_FE_CMDS="cd $PWD/application/fe && pnpm run dev"
osascript -e "tell app \"Terminal\"
    do script \"$RUN_FE_CMDS\"
end tell"
echo ">>> Access React web interface at http://localhost:$FE_PORT" 
