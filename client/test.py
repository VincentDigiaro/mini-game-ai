import requests
import json

url = 'http://109.210.115.164:8080'
data = {'question': 'hello'}
headers = {'Content-Type': 'application/json'}

response = requests.post(url, data=json.dumps(data), headers=headers)
print(response.text)