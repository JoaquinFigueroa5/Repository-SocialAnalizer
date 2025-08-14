#!/bin/bash

echo "Instalando dependencias de Python..."
pip install -r src/tools/social-analyzer/requirements.txt

echo "Iniciando backend Node.js..."
npm install