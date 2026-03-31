# VueJS Quiz — État d'avancement


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
	- a completer par nolan

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
python -m server.commands
```

### Frontend

```bash
cd quiz_vuerouter
npm install
npm run dev
```

Frontend : `http://localhost:5173`  
Backend API : `http://localhost:5000`

