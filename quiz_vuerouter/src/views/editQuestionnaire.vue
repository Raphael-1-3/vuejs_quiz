<script>
import Questionnaire_item from '@/components/questionnaire_item.vue';
import Question_item from '@/components/question_item.vue';
import {
  getQuestionnaires,
  createQuestionnaire,
  deleteQuestionnaire,
  updateQuestionnaire
} from '@/js/api_questionnaire';
import {
  createOpenQuestion,
  deleteQuestion,
  updateQuestion
} from '@/js/api_question';

export default {

  data() {
    return {
      quiz: [],
      title: 'Mes questionnaires',
      newItem: '',
      selectedQuestionnaireId: null,
      selectedQuestionnaireName: '',
      selectedQuestions: [],
      newQuestionText: '',
      newQuestionAnswer: ''
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
      addItem: async function () {
        let text = this.newItem.trim();
        if (text) {
          try {
              const questionnaire = await createQuestionnaire(text);
              this.quiz.push(questionnaire);
              this.newItem = "";
          } catch (error) {
            console.error("erreur lors de l'ajout", error);
          }
          };
          this.newItem = '';
        },
      
      removeItem: async function(index)
      {
        //
        var questionnaire_id = this.quiz[index].id;
        try {
          if (questionnaire_id){
          await deleteQuestionnaire(questionnaire_id);
            this.quiz.splice(index, 1);
            if (this.selectedQuestionnaireId === questionnaire_id) {
              this.selectedQuestionnaireId = null;
              this.selectedQuestionnaireName = '';
              this.selectedQuestions = [];
            }
            //this.loadTask();
          questionnaire_id = null;
        }} catch (error) {
          console.error(error);}
      },
      updateItem: async function(index, newText)
      {
        try {
          var questionnaire_id = this.quiz[index].id;
          if(questionnaire_id){
            const questionnaire = await updateQuestionnaire(questionnaire_id, newText);
            this.quiz[index] = questionnaire;
            questionnaire_id = null;
          }
          
        } catch (error) {
          console.error(error);
        }
      },
      openQuestionEditor(questionnaire) {
        this.selectedQuestionnaireId = questionnaire.id;
        this.selectedQuestionnaireName = questionnaire.name;
        this.selectedQuestions = questionnaire.questions || [];
      },
      addQuestion: async function () {
        const enonce = this.newQuestionText.trim();
        const reponse = this.newQuestionAnswer.trim();

        if (!this.selectedQuestionnaireId || !enonce || !reponse) {
          return;
        }

        try {
          const createdQuestion = await createOpenQuestion(this.selectedQuestionnaireId, enonce, reponse);
          this.selectedQuestions.push(createdQuestion);
          this.newQuestionText = '';
          this.newQuestionAnswer = '';

          const questionnaire = this.quiz.find(item => item.id === this.selectedQuestionnaireId);
          if (questionnaire) {
            questionnaire.questions = [...this.selectedQuestions];
          }
        } catch (error) {
          console.error(error);
        }
      },
      removeQuestion: async function (index) {
        if (!this.selectedQuestionnaireId) {
          return;
        }

        const question = this.selectedQuestions[index];
        if (!question) {
          return;
        }

        try {
          await deleteQuestion(this.selectedQuestionnaireId, question.numero);
          this.selectedQuestions.splice(index, 1);

          const questionnaire = this.quiz.find(item => item.id === this.selectedQuestionnaireId);
          if (questionnaire) {
            questionnaire.questions = [...this.selectedQuestions];
          }
        } catch (error) {
          console.error(error);
        }
      },
      updateQuestion: async function (index, payload) {
        if (!this.selectedQuestionnaireId) {
          return;
        }

        const question = this.selectedQuestions[index];
        if (!question) {
          return;
        }

        const enonce = payload?.enonce?.trim();
        const reponse = payload?.reponse?.trim();

        if (!enonce) {
          return;
        }

        const requestPayload = { enonce };
        if (question.reponse !== undefined && question.reponse !== null && reponse !== undefined) {
          requestPayload.reponse = reponse;
        }

        try {
          const updatedQuestion = await updateQuestion(this.selectedQuestionnaireId, question.numero, requestPayload);
          this.selectedQuestions[index] = updatedQuestion;

          const questionnaire = this.quiz.find(item => item.id === this.selectedQuestionnaireId);
          if (questionnaire) {
            questionnaire.questions = [...this.selectedQuestions];
          }
        } catch (error) {
          console.error(error);
        }
      },
      Deco: function(){localStorage.clear();}
      
    },
    components : { Questionnaire_item, Question_item }


}
</script>


<template>
<h1>Questionnaire</h1>
<h2>{{ title }}</h2>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: start;">
    <section>
      <ol>
        <Questionnaire_item
          v-for="(questionnaire, index) in quiz"
          :key="questionnaire.id"
          :questionnaire="questionnaire"
          @remove="removeItem(index)"
          @update="updateItem(index, $event)"
          @edit-questions="openQuestionEditor"
        />
      </ol>

      <div class="input-group">
        <input v-model="newItem"
          @keyup.enter="addItem"
          placeholder="Ajouter un questionnaire"
          type="text"
          class="form-control">
        <span class="input-group-btn">
          <button @click="addItem"
          class="btn btn-primary"
          type="button">Ajouter</button>
        </span>
      </div>
    </section>

    <section>
      <h3 v-if="selectedQuestionnaireId">Questions : {{ selectedQuestionnaireName }}</h3>
      <p v-else>Sélectionne “Éditer les questions” sur un questionnaire.</p>

      <template v-if="selectedQuestionnaireId">
        <ol>
          <Question_item
            v-for="(question, index) in selectedQuestions"
            :key="question.numero"
            :question="question"
            @remove="removeQuestion(index)"
            @update="updateQuestion(index, $event)"
          />
        </ol>

        <div class="input-group" style="margin-top: 0.5rem;">
          <input
            v-model="newQuestionText"
            placeholder="Énoncé de la question"
            type="text"
            class="form-control"
          >
        </div>
        <div class="input-group" style="margin-top: 0.5rem;">
          <input
            v-model="newQuestionAnswer"
            @keyup.enter="addQuestion"
            placeholder="Réponse (question ouverte)"
            type="text"
            class="form-control"
          >
          <span class="input-group-btn">
            <button
              @click="addQuestion"
              class="btn btn-primary"
              type="button"
            >Ajouter question</button>
          </span>
        </div>
      </template>
    </section>
    <button type="button" @click="Deco"> deconnexion </button>
  </div>

</template>



