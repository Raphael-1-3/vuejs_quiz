<script>
import Questionnaire_item from '@/components/questionnaire_item.vue';
import Question_item from '@/components/question_item.vue';
import {
  getQuestionnaires,
  createQuestionnaire,
  deleteQuestionnaire,
  updateQuestionnaire
} from '@/js/api';

export default {

  data() {
    return {
      quiz: [],
      title: 'Choisissez le thème de votre quiz',
      newItem: '',
      selectedQuestionnaireId: null,
      selectedQuestionnaireName: '',
      selectedQuestions: [],
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
        console.log("Questions extraites :", this.selectedQuestions);
      },
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
        <ol>
          <Question_item
            v-for="(question, index) in selectedQuestions"
            :key="question.numero"
            :question="question"
            readonly
          />
        </ol>

        <div class="input-group" style="margin-top: 0.5rem;">
          <span class="input-group-btn">
            <!-- faire la methode verifQuestion -->
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

<style>
  ul {
    list-style-type: none;
  }
</style>

