import sys
import subprocess
import json

def run_social_analyzer(username):
    command = [
        "python", 
        "src/tools/social-analyzer/app.py",
        "--username", username,
        "--output", "json",
        "--top", "50",
        "--extract"
    ]

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode == 0:
        print(result.stdout.decode())
    else:
        print(json.dumps({"error": "Fallo en ejecucion", "details": result.stderr.decode(errors='replace')}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Falta el username"}))
    else:
        run_social_analyzer(sys.argv[1])