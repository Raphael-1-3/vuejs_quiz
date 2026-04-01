# VueJS Quiz — État d'avancement

Identifiant : nolan

Mdp : mor

(en cas de probleme l'idendifiant et le mdp sont en dur dans le code)
### Frontend (Vue 3 + Vite + Vue Router)
- Navigation de base :
	- `/` (Accueil)
	- `/about`
	- `/edit-questionnaire`

- Vue `editQuestionnaire.vue`  :
	- charger les questionnaires
	- ajouter un questionnaire
	- modifier le nom d’un questionnaire
	- supprimer un questionnaire
	- supprimer/modifier/ajouter des questions à un questionnaire

- Vue `jouer` : 
	- charger les questionnaires
	- peut choisir un questionnaire pour y jouer
	- peut repondre aux questions
	- obtient un resultat en fonction de ses reponses
	- a un affichage des reponses corrigé ou le joueur c'est trompé

### Architecture 
```txt
src/
	components/
		question_item.vue  => permet l'edition de question
		questionnaire_item.vue => permet l'editon de questionnaire
	js/
		api_question.js => consomme l'api
		api_questionnaire.js
	views/
		about.vue 
		editQuestionnaire.vue 
		Home.vue
		login.vue
		jouer.vue
	App.vue
	main.js
```


##  Lancer le projet

### Backend
Depuis la racine du projet :

```bash
pip install -r requirements.txt
flask run
```

### Frontend

```bash
cd quiz_vuerouter
npm install
npm run dev
```

Frontend : `http://localhost:5173`  
Backend API : `http://localhost:5000`


## notes 

- state management -> store reactive 
- input text vide / 2 fois les  meme nom/champs/reponse
- gestion des doublons
- implementer l'edition de question a choix multiple | 
- faire des pages differentes pour la selection et le jeu | une "page" par question 
- style pour les reponse correcte ou incorrect |  fond rouger/vert | afficher les reponses 
- deplacer des affichage dans les composant item. 
- refactorisation des vue 
- completer le readme 
- composant avec les questionnaires 
- reorganisation de code 
- release v1 main
