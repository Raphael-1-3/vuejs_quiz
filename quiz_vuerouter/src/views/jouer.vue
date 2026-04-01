<script>
import Questionnaire_item from '@/components/questionnaire_item.vue';
import SelectedQuestionsList from '@/components/questions_list.vue';
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
      questionResultsClass: {},
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
        this.questionResultsClass = {};
      },
      verifQuestion() {
        let score = 0;
        const total = this.selectedQuestions.length;
        this.questionResultsClass = {};

        this.selectedQuestions.forEach((question) => {
          const answer = this.answers[question.numero];

          if (question.type === 'ouverte') {
            if (typeof answer === 'string' && answer.trim().toLowerCase() === String(question.reponse).trim().toLowerCase()) {
              score += 1;
              this.questionResultsClass[question.numero] = "bon";
            } else {
              this.questionResultsClass[question.numero] = "mauvais";
            }
          } else if (question.type === 'fermee') {
            if (Number(answer) === Number(question.ind_reponse)) {
              score += 1;
              this.questionResultsClass[question.numero] = "bon";
            } else {
              this.questionResultsClass[question.numero] = "mauvais";
            }
          }
        });
        this.verificationResult = `Résultat : ${score} / ${total}`;
      }
  },
  components : { Questionnaire_item, SelectedQuestionsList, Question_item }
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
        <SelectedQuestionsList
          :selectedQuestions="selectedQuestions"
          :answers="answers"
          :questionResultsClass="questionResultsClass"
          @update:answers="answers = $event"
        />

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
