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
  createClosedQuestion,
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
      newQuestionAnswer: '',
      questionType: 'ouverte',
      newProposition1: '',
      newProposition2: '',
      newIndReponse: null
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

        if (!this.selectedQuestionnaireId || !enonce) {
          return;
        }

        try {
          let createdQuestion;

          if (this.questionType === 'ouverte') {
            const reponse = this.newQuestionAnswer.trim();
            if (!reponse) {
              alert('Veuillez saisir une réponse.');
              return;
            }
            createdQuestion = await createOpenQuestion(this.selectedQuestionnaireId, enonce, reponse);
          } else if (this.questionType === 'fermee') {
            const prop1 = this.newProposition1.trim();
            const prop2 = this.newProposition2.trim();

            if (!prop1 || !prop2) {
              alert('Veuillez remplir les 2 propositions.');
              return;
            }
            if (!this.newIndReponse) {
              alert('Veuillez sélectionner la bonne réponse.');
              return;
            }
            createdQuestion = await createClosedQuestion(
              this.selectedQuestionnaireId,
              enonce,
              [prop1, prop2],
              this.newIndReponse
            );
          }

          this.selectedQuestions.push(createdQuestion);
          this.newQuestionText = '';
          this.newQuestionAnswer = '';
          this.newProposition1 = '';
          this.newProposition2 = '';
          this.newIndReponse = null;

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
        if (!enonce) {
          return;
        }

        const requestPayload = { enonce };

        // Question ouverte
        if (question.reponse !== undefined && question.reponse !== null) {
          const reponse = payload?.reponse?.trim();
          if (reponse !== undefined) {
            requestPayload.reponse = reponse;
          }
        }

        // Question fermée
        if (question.propositions) {
          if (payload.propositions) {
            requestPayload.propositions = payload.propositions;
          }
          if (payload.ind_reponse) {
            requestPayload.ind_reponse = payload.ind_reponse;
          }
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
      Deco: function(){
        localStorage.clear();
        this.$router.push('/login')
      }
      
    },
    components : { Questionnaire_item, Question_item }


}
</script>


<template>
<h1>Questionnaire</h1>
<button type="button" @click="Deco"> deconnexion </button>
<h2>{{ title }}</h2>
  <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; align-items: start;">
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

        <div class="mb-3 mt-3">
          <label class="form-label fw-bold">Type de question</label>
          <div>
            <input type="radio" id="type-ouverte" value="ouverte" v-model="questionType" class="form-check-input">
            <label for="type-ouverte" class="form-check-label ms-1 me-3">Question ouverte</label>

            <input type="radio" id="type-fermee" value="fermee" v-model="questionType" class="form-check-input">
            <label for="type-fermee" class="form-check-label ms-1">Question fermée (QCM)</label>
          </div>
        </div>

        <div class="input-group mb-2">
          <input
            v-model="newQuestionText"
            placeholder="Énoncé de la question"
            type="text"
            class="form-control"
          >
        </div>

        <div v-if="questionType === 'ouverte'" class="input-group mb-2">
          <input
            v-model="newQuestionAnswer"
            @keyup.enter="addQuestion"
            placeholder="Réponse"
            type="text"
            class="form-control"
          >
          <span class="input-group-btn">
            <button
              @click="addQuestion"
              class="btn btn-primary"
              type="button"
            >Ajouter question ouverte</button>
          </span>
        </div>

        <div v-if="questionType === 'fermee'" class="mb-2">
          <div class="input-group mb-2">
            <span class="input-group-text">Proposition 1</span>
            <input
              v-model="newProposition1"
              placeholder="Première proposition"
              type="text"
              class="form-control"
            />
          </div>

          <div class="input-group mb-2">
            <span class="input-group-text">Proposition 2</span>
            <input
              v-model="newProposition2"
              placeholder="Deuxième proposition"
              type="text"
              class="form-control"
            />
          </div>

          <select v-model.number="newIndReponse" class="form-select mb-2">
            <option :value="null">-- Sélectionnez la bonne réponse --</option>
            <option :value="1">Proposition 1</option>
            <option :value="2">Proposition 2</option>
          </select>

          <button
            @click="addQuestion"
            class="btn btn-primary w-100"
            type="button"
          >Ajouter question fermée</button>
        </div>
      </template>
    </section>
  </div>

</template>



