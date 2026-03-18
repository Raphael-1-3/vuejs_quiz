<script>
import Questionnaire_item from '@/components/questionnaire_item.vue';

const api_url = "https://localhost:3000"

export default {

  data() {
    return {
      quiz: [],
      title: 'Mes questionnaire',
      newItem: ''
    };
  },
  async mounted() {
    await this.loadQuiz();
  },
  methods: {
    async loadQuiz(){
      try {
        const response = await fetch(api_url)
        const data = await response.json();
        this.quiz = data.map(questionnaire =>({ //a changer en fonction de l'api
          id : questionnaire.id,
          text : questionnaire.title,
          checked : questionnaire.completed
        }));
      } catch (error) {
        console.error("erreur chargement", error);
        
      }
    },
      addItem: async function () {
        let text = this.newItem.trim();
        if (text) {
          try {
              const response = await fetch(api_url, 
                {
                  method : 'POST',
                  headers : {'Content-Type' : 'application/json'},
                  body : JSON.stringify({title: text, questions : []})
                }
              );
              if (response.ok){
              const data = await response.json();
              this.quiz.push({id: data.id, text : data.title, questions : data.questions});
              this.newItem = "";
              }
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
          const response = await fetch(`${api_url}/${questionnaire_id}`, {
            method: "DELETE",
            headers: {"Content-Type" : 'application/json'},
          });
          if (response.ok){
            this.quiz.splice(index, 1);
            //this.loadTask();
          }
          questionnaire_id = null;
        }} catch (error) {
          console.error(error);}
      },
      updateItem: async function(index, newText)
      {
        try {
          var questionnaire_id = this.quiz[index].id;
          if(questionnaire_id){
            const questionnaire = this.quiz[index];
            const response = await fetch(`${api_url}/${questionnaire_id}`,
              {
                method: 'PUT',
                headers: {"Content-Type" : 'application/json'},
                body: JSON.stringify({title: questionnaire.newText})
              }
            );
            if (response.ok){
              questionnaire.text = newText;
            }
            questionnaire_id = null;
          }
          
        } catch (error) {
          console.error(error);
        }
        this.quiz[index].text = newText;
      }
    },
    components : { Questionnaire_item }


}
</script>


<template>
<h1>putain de ta mere la pute ça marche</h1>
<h2>{{ title }}</h2>
  <ol>
<todo_item v-for="(questionnaire, index) in quiz" :key="questionnaire.id" :questionnaire="questionnaire" @remove="removeItem(index)" @update="updateItem(index, $event)" />
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



