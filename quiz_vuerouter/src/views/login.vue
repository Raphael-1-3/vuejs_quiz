<script>
export default {
	data() {
		return {
			username: '',
			password: '',
			errorMessage: ''
		}
	},
	mounted() {
		if (localStorage.getItem('authToken')) {
			this.$router.push('/edit-questionnaire')
		}
	},
	methods: {
		submitLogin() {
			this.errorMessage = ''

			const username = this.username.trim()
			const password = this.password.trim()

			if (!username || !password) {
				this.errorMessage = 'Veuillez renseigner votre identifiant et votre mot de passe.'
				return
			}

			// Placeholder auth flow; replace with API call when backend auth is ready.
			if (username === "nolan" && password === "mor")
            {
                const Auten = true;
                localStorage.setItem('authToken', Auten);
                this.$router.push('/edit-questionnaire');
            }
            else this.$outer.push('/login');
			

			
		}
	}
}
</script>

<template>
	<section class="login-page">
		<h2>Connexion</h2>
		<form class="login-form" @submit.prevent="submitLogin">
			<label for="username">Identifiant</label>
			<input
				id="username"
				v-model="username"
				type="text"
				autocomplete="username"
				placeholder="Votre identifiant"
			>

			<label for="password">Mot de passe</label>
			<input
				id="password"
				v-model="password"
				type="password"
				autocomplete="current-password"
				placeholder="Votre mot de passe"
			>

			<p v-if="errorMessage" class="error">{{ errorMessage }}</p>

			<button type="submit">Se connecter</button>
		</form>
	</section>
</template>

