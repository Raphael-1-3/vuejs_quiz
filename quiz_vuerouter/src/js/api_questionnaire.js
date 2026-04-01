const API_URL = 'http://localhost:5000/quiz/api/v1.0/questionnaires';

function normalizeQuestionnaire(questionnaire) {
	return {
		id: questionnaire.id,
		name: questionnaire.nom,
		questions: questionnaire.questions || []
	};
}

export async function getQuestionnaires() {
	const response = await fetch(API_URL);
	if (!response.ok) {
		throw new Error('Erreur lors du chargement des questionnaires');
	}

	const data = await response.json();
	const questionnaires = data.questionnaires || [];
	return questionnaires.map(normalizeQuestionnaire);
}

export async function createQuestionnaire(name) {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nom: name })
	});

	if (!response.ok) {
		throw new Error('Erreur lors de la création du questionnaire');
	}

	const data = await response.json();
	return normalizeQuestionnaire(data.result);
}

export async function deleteQuestionnaire(questionnaireId) {
	const response = await fetch(`${API_URL}/${questionnaireId}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' }
	});

	if (!response.ok) {
		throw new Error('Erreur lors de la suppression du questionnaire');
	}
}

export async function updateQuestionnaire(questionnaireId, newName) {
	const response = await fetch(`${API_URL}/${questionnaireId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nom: newName })
	});

	if (!response.ok) {
		throw new Error('Erreur lors de la mise à jour du questionnaire');
	}

	const data = await response.json();
	return normalizeQuestionnaire(data.result);
}
