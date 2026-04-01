<script>
import Questionnaire_item from '@/components/questionnaire_item.vue';
import Question_item from '@/components/question_item.vue';
import {
  getQuestionnaires,
  createQuestionnaire,
  deleteQuestionnaire,
  updateQuestionnaire
} from '@/js/api_questionnaire.js';

export default {

  data() {
    return {
      quiz: [],
      title: 'Choisissez le thème de votre quiz',
      newItem: '',
      selectedQuestionnaireId: null,
      selectedQuestionnaireName: '',
      selectedQuestions: [],
      answers: {},
      verificationResult: null,
    };
  },
  async mounted() {
    await this.loadQuiz();
  },
  methods: {
    async loadQuiz(){
      try {
        this.quiz = await getQuestionnaires();
      } catch (error) {
        console.error("erreur chargement", error);
        
      }
    },
    openQuestionEditor(questionnaire) {
        console.log("Questionnaire reçu :", questionnaire);
        this.selectedQuestionnaireId = questionnaire.id;
        this.selectedQuestionnaireName = questionnaire.name;
        this.selectedQuestions = questionnaire.questions || [];
        this.answers = {};
        this.verificationResult = null;
      },
      verifQuestion() {
        let score = 0;
        const total = this.selectedQuestions.length;

        this.selectedQuestions.forEach((question) => {
          const answer = this.answers[question.numero];

          if (question.type === 'ouverte') {
            if (typeof answer === 'string' && answer.trim().toLowerCase() === String(question.reponse).trim().toLowerCase()) {
              score += 1;
            }
          } else if (question.type === 'fermee') {
            if (Number(answer) === Number(question.ind_reponse)) {
              score += 1;
            }
          }
        });
        this.verificationResult = `Résultat : ${score} / ${total}`;
      }
  },
  components : { Questionnaire_item, Question_item }
}
</script>


<template>
  <h1>Jouer</h1>
  <h2>{{ title }}</h2>
  <ul>
    <Questionnaire_item v-for="(questionnaire, index) 
    in quiz" :key="questionnaire.id" :questionnaire="questionnaire" 
    readonly @play="openQuestionEditor(questionnaire)"/>
  </ul>
   <section>
      <h3 v-if="selectedQuestionnaireId">Thème choisie : {{ selectedQuestionnaireName }}</h3>

      <template v-if="selectedQuestionnaireId">
        <ul>
          <li v-for="(question, index) in selectedQuestions" :key="question.numero">
            <Question_item :question="question" readonly />

            <div v-if="question.type === 'ouverte'">
              <input v-model="answers[question.numero]" class="form-control" type="text" placeholder="Votre réponse" />
            </div>

            <div v-else-if="question.type === 'fermee'">
              <div v-for="(prop, idx) in question.propositions" :key="idx" class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  :name="`q-${question.numero}`"
                  :value="idx + 1"
                  v-model="answers[question.numero]"
                />
                <label class="form-check-label">{{ prop }}</label>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="verificationResult" style="margin-top: .5rem;">
          <strong>{{ verificationResult }}</strong>
        </div>

        <div class="input-group" style="margin-top: 0.5rem;">
          <span class="input-group-btn">
            <button
              @click="verifQuestion"
              class="btn btn-primary"
              type="button"
            >Valider</button>
          </span>
        </div>
      </template>
    </section>
</template>
