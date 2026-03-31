<script>

export default{
    props: {
        question : Object
    },
    emits: ['remove', 'update'],
    data() {
        return {
            editing: false,
      editText: '',
      editAnswer: ''
        };
    },
    methods: {
        startEdit() {
      this.editText = this.question.enonce;
      this.editAnswer = this.question.reponse || '';
            this.editing = true;
        },
        saveEdit() {
      const enonce = this.editText.trim();
      const hasAnswer = this.question.reponse !== undefined && this.question.reponse !== null;
      const reponse = this.editAnswer.trim();

      if (!enonce) {
        return;
      }

      if (hasAnswer && !reponse) {
        return;
            }

      this.$emit('update', {
        enonce,
        ...(hasAnswer ? { reponse } : {})
      });
            this.editing = false;
        }
    }
}

</script>
<template>
    <li v-bind:class="{}">
      <div >
        <div class="checkbox flex-grow-1">
          <div v-if="editing">
            <input type="text" class="form-control" v-model="editText" @keyup.enter="saveEdit" @keyup.esc="editing = false"/>
            <input
              v-if="question.reponse !== undefined && question.reponse !== null"
              type="text"
              class="form-control"
              v-model="editAnswer"
              placeholder="Réponse"
              style="margin-top: 0.5rem;"
            />
            <button @click="saveEdit" class="btn btn-success btn-sm">OK</button>
            <button @click="editing = false" class="btn btn-secondary btn-sm">Annuler</button>
          </div>
          <div v-else>
            {{ question.enonce }}
            <div v-if="question.reponse !== undefined && question.reponse !== null">
              Réponse : {{ question.reponse }}
            </div>
          </div>
        </div>
        <div class="ms-2" v-if="!editing">
          <button @click="startEdit" class="btn btn-warning btn-sm me-1">Modifier</button>
          <button @click="$emit('remove')" class="btn btn-danger btn-sm">Supprimer</button>
        </div>
      </div>
    </li>
</template>