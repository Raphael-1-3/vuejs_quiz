<script>

export default{
    props: {
        questionnaire : Object,
        readonly: {
          type: Boolean,
          default: false
        }
    },
    emits: ['remove', 'update', 'play'],
    data() {
        return {
            editing: false,
            editText: '',
        };
    },
    methods: {
        startEdit() {
        this.editText = this.questionnaire.name;
            this.editing = true;
        },
        saveEdit() {
            const text = this.editText.trim();
            if (text) {
                this.$emit('update', text);
            }
            this.editing = false;
        }
    }
}

</script>
<template>
    <li v-bind:class="{}">
      <div >
        <div class="checkbox flex-grow-1">
          <div v-if="editing && !readonly">
            <input type="text" class="form-control" v-model="editText" @keyup.enter="saveEdit" @keyup.esc="editing = false"/>
            <button @click="saveEdit" class="btn btn-success btn-sm">OK</button>
            <button @click="editing = false" class="btn btn-secondary btn-sm">Annuler</button>
          </div>
          <div v-else>
            {{ questionnaire.name }}
          </div>
        </div>
        <div class="ms-2" v-if="!editing && !readonly">
          <button @click="startEdit" class="btn btn-warning btn-sm me-1">Modifier</button>
          <button @click="$emit('remove')" class="btn btn-danger btn-sm">Supprimer</button>
        </div>
        <div v-if="readonly">
          <button @click="$emit('play', questionnaire)" class="btn btn-primary" type="button">Jouer</button>
        </div>
      </div>
    </li>
</template>