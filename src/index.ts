import { App } from 'vue';
import PasswordStrengthIndicator from './components/PasswordStrengthIndicator.vue';

export default {
  install: (app: App) => {
    app.component('PasswordStrengthIndicator', PasswordStrengthIndicator);
  },
};
