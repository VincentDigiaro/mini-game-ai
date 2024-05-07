# mini-game-ai

Build models and run server 
```
cd server
ollama create chacha -f ./model_chacha
ollama create jean -f ./model_jean
python serve.py
```

Run client
```
cd client
python -m http.server 8081
```
