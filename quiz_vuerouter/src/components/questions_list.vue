
<script>
import Question_item from './question_item.vue';

export default {
  name: 'SelectedQuestionsList',
  components: { Question_item },
  props: {
    selectedQuestions: {
      type: Array,
      default: () => []
    },
    answers: {
      type: Object,
      default: () => ({})
    },
    questionResultsClass: {
      type: Object,
      default: () => ({})
    },
    correction: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    getQuestionClass(numero) {
      return this.questionResultsClass[numero] || '';
    },
    render_correction(numero) {
      let corr = this.correction[numero] || '';
      if (corr != '') {
        return "La réponse était : " + corr;
      }
    }
  }
};
</script>

<template>
  <ul>
    <li
      v-for="(question, index) in selectedQuestions"
      :key="question.numero"
      :class="getQuestionClass(question.numero)"
    >
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
        <p>{{ render_correction(question.numero) }}</p>
        </li>
    </ul>
</template>
