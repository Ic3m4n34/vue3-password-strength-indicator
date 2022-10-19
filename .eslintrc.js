module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb',
    '@vue/typescript/recommended',
  ],
  rules: {
    'max-len': ['error', {
      ignoreTemplateLiterals: true, ignoreStrings: true, ignorePattern: 'd="([\\s\\S]*?)"', code: 160,
    }],
  },
};
