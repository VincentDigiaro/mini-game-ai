from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from urllib.parse import parse_qs
import subprocess
import re
import requests
import os

jsonHistory =  {}

fichiers = os.listdir('.')
modeles = [fichier.replace('model_', '') for fichier in fichiers if fichier.startswith('model_')]
modeles.append("llama3")


class CORSHTTPRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        # Autoriser toutes les origines
        self.send_header('Access-Control-Allow-Origin', '*')
        # Gérer les requêtes pré-envoi (Preflight)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        self.end_headers()

    def do_POST(self):
        
        self._set_headers()       
        
        content_length = int(self.headers['Content-Length'])
        
        # Lit les données postées et les décode en JSON
        post_data = self.rfile.read(content_length).decode('utf-8')
        post_vars = json.loads(post_data)
        
        
        required_keys = {'question', 'model', 'idPlayer'}
        received_keys = set(post_vars.keys())

        # Vérifier si tous les paramètres requis sont présents et qu'aucun supplémentaire n'est inclus
        if required_keys != received_keys:
            # Si les clés ne correspondent pas, renvoyer une erreur
            self.send_response(400)  # Bad Request
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response_data = json.dumps({"error": "Invalid request parameters. Please provide exactly 'question', 'model', and 'idPlayer'."})
            self.wfile.write(response_data.encode('utf-8'))
            return
        
        
        question = post_vars.get('question')
        model = post_vars.get('model')
        idPlayer = post_vars.get('idPlayer')
        
        url = 'http://localhost:11434/api/chat'
        headers = {'Content-Type': 'application/json'}
        
        userQuestion = {"role": "user", "content": question}
        
        if (idPlayer not in jsonHistory):
            if (idPlayer not in jsonHistory):
                jsonHistory[idPlayer] = {}
                for m in modeles:
                    jsonHistory[idPlayer][m] = []
            
        jsonHistory[idPlayer][model].append(userQuestion)
        
        data = json.dumps({
            "model": model,
            "stream": False,
            "messages": jsonHistory[idPlayer][model]
        })

        print("")
        print("player " + idPlayer+ " to " + model)
        print("question number " + str(1 + len(jsonHistory[idPlayer][model])//2) + ":")    
        print(" - "+question)
        
        # Magic
        response = requests.post(url, headers=headers, data=data) 
        
        message = json.loads(response.text)     
        result =  message.get('message').get('content')
        botResponse = {"role": "assistant", "content": result}
   
        print("answer:")
        print(" - "+result)
        print("")
        
        jsonHistory[idPlayer][model].append(botResponse)
        
        # Affiche et répond à la requête

        self.send_response(200)  # 200 OK
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response_data = json.dumps({"message": f"{result}"})
        self.wfile.write(response_data.encode('utf-8'))

    def do_OPTIONS(self):
        self._set_headers()
        # Pas besoin d'ajouter plus de contenu ici, les en-têtes sont suffisants

def run(server_class=HTTPServer, handler_class=CORSHTTPRequestHandler):
    server_address = ('', 8080)
    httpd = server_class(server_address, handler_class)
    print('Serveur démarré, utilisez <Ctrl-C> pour arrêter')
    httpd.serve_forever()

if __name__ == "__main__":
    run()


