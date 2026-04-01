<script>

export default{
    props: {
        question : Object,
        readonly: {
          type: Boolean,
          default: false
        }
    },
    emits: ['remove', 'update'],
    data() {
        return {
            editing: false,
            editText: '',
            editAnswer: '',
            editProposition1: '',
            editProposition2: '',
            editIndReponse: null
        };
    },
    methods: {
        startEdit() {
            this.editText = this.question.enonce;
            this.editAnswer = this.question.reponse || '';

            if (this.question.propositions) {
                this.editProposition1 = this.question.propositions[0] || '';
                this.editProposition2 = this.question.propositions[1] || '';
                this.editIndReponse = this.question.ind_reponse;
            }

            this.editing = true;
        },
        saveEdit() {
            const enonce = this.editText.trim();
            if (!enonce) {
                return;
            }

            // Question ouverte
            if (this.question.reponse !== undefined && this.question.reponse !== null) {
                const reponse = this.editAnswer.trim();
                if (!reponse) {
                    return;
                }

                this.$emit('update', { enonce, reponse });
            }
            // Question fermée
            else if (this.question.propositions) {
                const prop1 = this.editProposition1.trim();
                const prop2 = this.editProposition2.trim();

                if (!prop1 || !prop2 || !this.editIndReponse) {
                    alert('Veuillez remplir les 2 propositions et sélectionner la bonne réponse.');
                    return;
                }

                this.$emit('update', {
                    enonce,
                    propositions: [prop1, prop2],
                    ind_reponse: this.editIndReponse
                });
            }

            this.editing = false;
        }
    }
}

</script>
<template>
    <li v-bind:class="{}">
      <div>
        <div class="checkbox flex-grow-1">
          <div v-if="editing && !readonly">
            <input type="text" class="form-control mb-2" v-model="editText" @keyup.enter="saveEdit" @keyup.esc="editing = false" placeholder="Énoncé"/>

            <!-- Question ouverte -->
            <input
              v-if="question.reponse !== undefined && question.reponse !== null"
              type="text"
              class="form-control mb-2"
              v-model="editAnswer"
              placeholder="Réponse"
            />

            <!-- Question fermée -->
            <div v-if="question.propositions" class="mb-2">
              <div class="input-group mb-2">
                <span class="input-group-text">Proposition 1</span>
                <input type="text" class="form-control" v-model="editProposition1" placeholder="Première proposition" />
              </div>

              <div class="input-group mb-2">
                <span class="input-group-text">Proposition 2</span>
                <input type="text" class="form-control" v-model="editProposition2" placeholder="Deuxième proposition" />
              </div>

              <select v-model.number="editIndReponse" class="form-select">
                <option :value="null">-- Sélectionnez la bonne réponse --</option>
                <option :value="1">Proposition 1</option>
                <option :value="2">Proposition 2</option>
              </select>
            </div>

            <button @click="saveEdit" class="btn btn-success btn-sm me-1 mt-2">OK</button>
            <button @click="editing = false" class="btn btn-secondary btn-sm mt-2">Annuler</button>
          </div>

          <div v-if="readonly">
            <p>
              {{ question.enonce }} (Type : {{ this.question.type }})
            </p>
          </div>

          <div v-else-if="!editing">
            <strong>{{ question.enonce }}</strong>

            <!-- Question ouverte -->
            <div v-if="question.reponse !== undefined && question.reponse !== null" class="mt-1" style="font-size: 0.9rem;">
              <span class="text-muted">Réponse:</span> {{ question.reponse }}
            </div>

            <!-- Question fermée -->
            <div v-if="question.propositions" class="mt-2">
              <div
                v-for="(prop, index) in question.propositions"
                :key="index"
                class="badge me-1 mb-1"
                :class="question.ind_reponse === (index + 1) ? 'bg-success' : 'bg-secondary'"
              >
                {{ index + 1 }}. {{ prop }}
              </div>
            </div>
          </div>
        </div>

        <div class="ms-2" v-if="!editing && !readonly">
          <button @click="startEdit" class="btn btn-warning btn-sm me-1">Modifier</button>
          <button @click="$emit('remove')" class="btn btn-danger btn-sm">Supprimer</button>
        </div>
      </div>
    </li>
</template>