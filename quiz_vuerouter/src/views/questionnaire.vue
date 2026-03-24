<script>
import Questionnaire_item from '@/components/questionnaire_item.vue';
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
      title: 'Mes questionnaires',
      newItem: ''
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
      }
    },
    components : { Questionnaire_item }


}
</script>


<template>
<h1>Questionnaire</h1>
<h2>{{ title }}</h2>
  <ol>
<Questionnaire_item v-for="(questionnaire, index) in quiz" :key="questionnaire.id" :questionnaire="questionnaire" @remove="removeItem(index)" @update="updateItem(index, $event)" />
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
</template>



