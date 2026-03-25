# VueJS Quiz — État d'avancement

Petit résumé de ce qui est déjà en place dans le projet.

## ✅ Ce qui a été fait

### Backend (Flask)
- API REST pour les questionnaires :
	- `GET /quiz/api/v1.0/questionnaires`
	- `GET /quiz/api/v1.0/questionnaires/<id>`
	- `POST /quiz/api/v1.0/questionnaires`
	- `PUT /quiz/api/v1.0/questionnaires/<id>`
	- `DELETE /quiz/api/v1.0/questionnaires/<id>`
- API REST pour les questions d’un questionnaire :
	- `POST /quiz/api/v1.0/questionnaires/<id>` (ajout question)
	- `GET /quiz/api/v1.0/questionnaires/<id>/questions/<num>`
	- `DELETE /quiz/api/v1.0/questionnaires/<id>/questions/<num>`
- Base SQLite avec SQLAlchemy (`server/models.py`), CORS activé.

### Frontend (Vue 3 + Vite + Vue Router)
- Navigation de base :
	- `/` (Accueil)
	- `/about`
	- `/questionnaire`
- Vue `questionnaire.vue` fonctionnelle pour :
	- charger les questionnaires
	- ajouter un questionnaire
	- modifier le nom d’un questionnaire
	- supprimer un questionnaire
- Composant `questionnaire_item.vue` corrigé pour l’affichage/édition du nom.

### Refactor API côté Front
- Extraction des appels `fetch` questionnaires dans `src/js/api_questionnaire.js` pour éviter la duplication :
	- `getQuestionnaires`
	- `createQuestionnaire`
	- `updateQuestionnaire`
	- `deleteQuestionnaire`
- Création d’un module `src/js/api_question.js` pour les questions :
	- `createOpenQuestion`
	- `createClosedQuestion`
	- `getQuestion`
	- `deleteQuestion`

## 🚧 À faire ensuite (prochaines étapes)
- Créer la vue `edit_questionnaire.vue` (actuellement vide) pour gérer les questions depuis l’UI.
- Connecter cette vue aux fonctions de `api_question.js`.
- Ajouter la route dédiée dans `src/js/router.js`.
- Corriger/finir le composant `question_item.vue` (logique d’édition et affichage des champs `enonce`, etc.).

## ▶️ Lancer le projet

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

