# mini-game-ai

## Server side

You need https://github.com/ollama/ollama up and running as as service
Then pull llama3
```
ollama pull llama3
```

use python 3.7 or around
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Build models and run server 
```
cd server
ollama create chacha -f ./model_chacha
ollama create jean -f ./model_jean
python serve.py
```

## Client side

create client/config.js (git ignored) with this variable and add the IP of the server:
```
serverUrl = 'http://<put_your_server_ip_here>:8080'; 
```
(The server has not to be on the same machine)

Run client from command line (venv activated)
```
cd client
python -m http.server 8081
```

Browse http://<put_yout_ip_here>:8081
