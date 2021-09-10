# Le jeu des collègues

Florent DIDION, Nikolas Kosanovic, Thibault Chatillon

## Description

Un jeu d'esquive/de vitesse controllable à distance avec une pysense

## Plus en détail

### Technologies utilisés 
* Javascript et librairie pixi.js pour la partie graphique (le jeu)
* MicroPython, le code qui est executé sur la carte pysense

### Fonctionnement

* après avoir établi un connexion via wifi, le pc (client) envoie des requetes GET à la carte (serveur) en continu.
* celle-ci réponds avec ses données (acceleromètre et état du boutton)
* en utilisant ces données on peut gérer le jeu : déplacements, play, replay


### Exécution du programme

* git clone 
* liveserver (vscode) ou autre serveur pour lancer spaceSurvivor.html ou tondeuse.html (selon l'humeur)
