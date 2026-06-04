export const ANSWER_STATUS = Object.freeze({
  CORRECT: "correct",
  INCORRECT: "incorrect",
  UNSELECTED: "unselected",
});

export const getCorrectOption = (question = {}) => {
  const options = Array.isArray(question.options) ? question.options : [];
  return options.find((option) => Boolean(option.correct)) || null;
};

export const getSelectedAnswer = (questionId, userAnswers = {}) => {
  const value = userAnswers?.[questionId];
  return value === null || value === undefined || value === "" ? null : String(value);
};

export const getQuestionAnswerStatus = (question = {}, userAnswers = {}) => {
  const selectedAnswer = getSelectedAnswer(question.id, userAnswers);
  if (!selectedAnswer) return ANSWER_STATUS.UNSELECTED;

  const correctOption = getCorrectOption(question);
  return selectedAnswer === correctOption?.label
    ? ANSWER_STATUS.CORRECT
    : ANSWER_STATUS.INCORRECT;
};

export const getAnswerCounts = (questions = [], userAnswers = {}) => {
  return questions.reduce(
    (counts, question) => {
      const status = getQuestionAnswerStatus(question, userAnswers);
      counts[status] += 1;
      return counts;
    },
    {
      correct: 0,
      incorrect: 0,
      unselected: 0,
      total: Array.isArray(questions) ? questions.length : 0,
    },
  );
};

export const buildIncorrectQuestions = (questions = [], userAnswers = {}) => {
  return questions
    .filter((question) => getQuestionAnswerStatus(question, userAnswers) === ANSWER_STATUS.INCORRECT)
    .map((question) => {
      const correctOption = getCorrectOption(question);
      return {
        questionId: question.id,
        content: question.content,
        topicName: question.topicName,
        level: question.level,
        userAnswer: getSelectedAnswer(question.id, userAnswers),
        correctAnswer: correctOption?.label || null,
      };
    });
};
