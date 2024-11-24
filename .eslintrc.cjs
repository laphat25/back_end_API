// TrungQuanDev: https://youtube.com/@trungquandev
module.exports = {
  env: { es2020: true, node: true },
  extends: [
    'eslint:recommended'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    allowImportExportEverywhere: true
  },
  plugins: [],
  rules: {
    // Common
    'no-console': 1,  // Cảnh báo khi sử dụng các câu lệnh console (như console.log()).
    'no-extra-boolean-cast': 0, //tắt cảnh báo về các phép chuyển kiểu boolean dư thừa (ví dụ, !!someVar).
    'no-lonely-if': 1, //Cảnh báo khi có câu lệnh if đứng độc lập mà không có else phía sau.
    'no-unused-vars': 1, //Cảnh báo về các biến được khai báo nhưng không sử dụng.
    'no-trailing-spaces': 1, //Cảnh báo về các dấu cách thừa ở cuối dòng.
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': 1,
    'space-before-blocks': ['error', 'always'],
    'object-curly-spacing': [1, 'always'],
    'indent': ['warn', 2],
    'semi': [1, 'never'],
    'quotes': ['error', 'single'],
    'array-bracket-spacing': 1,
    'linebreak-style': 0,
    'no-unexpected-multiline': 'warn',
    'keyword-spacing': 1,
    'comma-dangle': 1,
    'comma-spacing': 1,
    'arrow-spacing': 1
  }
}
