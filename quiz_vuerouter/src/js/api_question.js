const BASE_URL = 'http://localhost:5000/quiz/api/v1.0/questionnaires';

function normalizeQuestion(question) {
	return {
		numero: question.numero,
		enonce: question.enonce,
		reponse: question.reponse,
		propositions: question.propositions || null,
		ind_reponse: question.ind_reponse ?? null
	};
}

function buildQuestionnaireUrl(questionnaireId) {
	return `${BASE_URL}/${questionnaireId}`;
}

function buildQuestionUrl(questionnaireId, questionNumero) {
	return `${buildQuestionnaireUrl(questionnaireId)}/questions/${questionNumero}`;
}

export async function createOpenQuestion(questionnaireId, enonce, reponse) {
	const response = await fetch(buildQuestionnaireUrl(questionnaireId), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ enonce, reponse })
	});

	if (!response.ok) {
		throw new Error('Erreur lors de la création de la question ouverte');
	}

	const data = await response.json();
	return normalizeQuestion(data.result);
}

export async function createClosedQuestion(questionnaireId, enonce, propositions, indReponse) {
	const response = await fetch(buildQuestionnaireUrl(questionnaireId), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			enonce,
			propositions,
			ind_reponse: indReponse
		})
	});

	if (!response.ok) {
		throw new Error('Erreur lors de la création de la question fermée');
	}

	const data = await response.json();
	return normalizeQuestion(data.result);
}

export async function getQuestion(questionnaireId, questionNumero) {
	const response = await fetch(buildQuestionUrl(questionnaireId, questionNumero));

	if (!response.ok) {
		throw new Error('Erreur lors du chargement de la question');
	}

	const data = await response.json();
	return normalizeQuestion(data.result);
}

export async function deleteQuestion(questionnaireId, questionNumero) {
	const response = await fetch(buildQuestionUrl(questionnaireId, questionNumero), {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' }
	});

	if (!response.ok) {
		throw new Error('Erreur lors de la suppression de la question');
	}
}
