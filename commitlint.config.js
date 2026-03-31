export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 日本語コミットメッセージ・固有名詞に対応するため subject-case チェックを無効化
    "subject-case": [0],
  },
};
