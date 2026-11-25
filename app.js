const TOTAL_QUESTIONS = 10;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const danButtons = document.querySelectorAll(".dan-button");

const backButton = document.getElementById("back-button");
const progress = document.getElementById("progress");
const scoreDisplay = document.getElementById("score");

const danLabel = document.getElementById("dan-label");
const questionElement = document.getElementById("question");

const answerForm = document.getElementById("answer-form");
const answerInput = document.getElementById("answer");

const message = document.getElementById("message");
const nextButton = document.getElementById("next-button");

// 過去の正誤履歴
const answerHistory = document.getElementById("answer-history");

const resultIcon = document.getElementById("result-icon");
const resultScore = document.getElementById("result-score");
const resultMessage = document.getElementById("result-message");

const mistakesArea = document.getElementById("mistakes-area");
const mistakeList = document.getElementById("mistake-list");

const retryButton = document.getElementById("retry-button");
const restartButton = document.getElementById("restart-button");

let selectedDan = null;

let questions = [];
let currentIndex = 0;
let score = 0;
let mistakes = [];

// true = 正解
// false = 不正解
let history = [];

let retryMode = false;


/* ------------------------------
   画面切り替え
------------------------------ */

function showScreen(screen) {
  startScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  resultScreen.classList.remove("active");

  screen.classList.add("active");
}


/* ------------------------------
   入力制御
   数字のみ・最大2桁
------------------------------ */

answerInput.addEventListener("input", () => {
  answerInput.value = answerInput.value
    .replace(/[^0-9]/g, "")
    .slice(0, 2);
});


/* ------------------------------
   段を選ぶ
------------------------------ */

danButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.dan;

    selectedDan =
      value === "random"
        ? "random"
        : Number(value);

    startGame();
  });
});


/* ------------------------------
   ゲーム開始
------------------------------ */

function startGame() {
  currentIndex = 0;
  score = 0;
  mistakes = [];
  history = [];

  retryMode = false;

  questions = createQuestions();

  showScreen(quizScreen);

  updateHistory();
  showQuestion();
}


/* ------------------------------
   問題を作る
------------------------------ */

function createQuestions() {
  const createdQuestions = [];

  /*
    同じ段の場合は1〜9をシャッフル。
    最初の9問は重複しない。
  */

  if (selectedDan !== "random") {
    const multipliers = shuffle([
      1, 2, 3, 4, 5, 6, 7, 8, 9
    ]);

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const b =
        i < multipliers.length
          ? multipliers[i]
          : randomNumber(1, 9);

      createdQuestions.push({
        a: selectedDan,
        b: b,
        answer: selectedDan * b
      });
    }
  } else {

    /*
      ごちゃまぜ
      2〜9の段からランダム出題
    */

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const a = randomNumber(2, 9);
      const b = randomNumber(1, 9);

      createdQuestions.push({
        a: a,
        b: b,
        answer: a * b
      });
    }
  }

  return createdQuestions;
}


/* ------------------------------
   問題表示
------------------------------ */

function showQuestion() {
  const currentQuestion = questions[currentIndex];

  progress.textContent =
    `${currentIndex + 1} / ${questions.length}`;

  scoreDisplay.textContent = `⭐ ${score}`;


  /*
    段ラベル
  */

  if (retryMode) {
    danLabel.textContent = "🔥 もういちど！";

  } else if (selectedDan === "random") {
    danLabel.textContent = "🔀 ごちゃまぜ";

  } else {
    danLabel.textContent = `${selectedDan}のだん`;
  }


  /*
    問題
  */

  questionElement.textContent =
    `${currentQuestion.a} × ${currentQuestion.b} = ?`;


  /*
    入力欄をリセット
  */

  answerInput.value = "";
  answerInput.disabled = false;

  message.textContent = "";
  message.className = "message";

  nextButton.classList.add("hidden");


  /*
    PCではすぐ入力可能にする
  */

  setTimeout(() => {
    answerInput.focus();
  }, 100);
}


/* ------------------------------
   Enter / 完了で答え合わせ
------------------------------ */

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  checkAnswer();
});


/* ------------------------------
   答え合わせ
------------------------------ */

function checkAnswer() {
  const currentQuestion = questions[currentIndex];

  const inputValue = answerInput.value.trim();


  /*
    未入力
  */

  if (inputValue === "") {
    message.textContent = "こたえを いれてね！";
    message.className = "message wrong";

    answerInput.focus();

    return;
  }


  const userAnswer = Number(inputValue);


  /*
    正解
  */

  if (userAnswer === currentQuestion.answer) {

    score++;

    history.push(true);

    message.textContent = randomCorrectMessage();
    message.className = "message correct";
  }


  /*
    不正解
  */

  else {

    history.push(false);

    message.textContent =
      `おしい！ こたえは ${currentQuestion.answer} だよ！`;

    message.className = "message wrong";


    /*
      通常モードのみ
      間違えた問題を保存
    */

    if (!retryMode) {
      mistakes.push({
        ...currentQuestion,
        userAnswer: userAnswer
      });
    }
  }


  /*
    〇×履歴更新
  */

  updateHistory();


  /*
    スコア更新
  */

  scoreDisplay.textContent = `⭐ ${score}`;


  /*
    二重回答を防ぐ
  */

  answerInput.disabled = true;


  /*
    次へボタン表示
  */

  nextButton.classList.remove("hidden");


  /*
    最後の問題
  */

  if (currentIndex === questions.length - 1) {
    nextButton.textContent =
      "けっかをみる！ 🎉";
  } else {
    nextButton.textContent =
      "つぎのもんだい →";
  }
}


/* ------------------------------
   過去10問の正誤履歴
------------------------------ */

function updateHistory() {
  answerHistory.innerHTML = "";


  /*
    通常モードは10個
    復習モードは復習問題数
  */

  const totalMarks =
    retryMode
      ? questions.length
      : TOTAL_QUESTIONS;


  for (let i = 0; i < totalMarks; i++) {
    const mark =
      document.createElement("span");

    mark.classList.add("history-mark");


    /*
      回答済み
    */

    if (i < history.length) {

      /*
        正解
      */

      if (history[i]) {
        mark.textContent = "〇";
        mark.classList.add("correct");

        mark.setAttribute(
          "aria-label",
          `${i + 1}問目 正解`
        );
      }


      /*
        不正解
      */

      else {
        mark.textContent = "×";
        mark.classList.add("wrong");

        mark.setAttribute(
          "aria-label",
          `${i + 1}問目 不正解`
        );
      }
    }


    /*
      未回答
    */

    else {
      mark.textContent = "・";
      mark.classList.add("empty");

      mark.setAttribute(
        "aria-label",
        `${i + 1}問目 未回答`
      );
    }


    answerHistory.appendChild(mark);
  }
}


/* ------------------------------
   次の問題
------------------------------ */

nextButton.addEventListener("click", () => {
  currentIndex++;


  /*
    全問終了
  */

  if (currentIndex >= questions.length) {
    showResult();

    return;
  }


  /*
    次の問題
  */

  showQuestion();
});


/* ------------------------------
   結果画面
------------------------------ */

function showResult() {
  showScreen(resultScreen);


  /*
    復習モード
  */

  if (retryMode) {
    resultIcon.textContent = "🔥";

    resultScore.textContent =
      `${questions.length}もん おわったよ！`;

    resultMessage.textContent =
      "にがてなもんだいに ちょうせんできたね！";

    mistakesArea.classList.add("hidden");

    return;
  }


  /*
    通常モード
  */

  resultScore.textContent =
    `${TOTAL_QUESTIONS}もんちゅう ${score}もん せいかい！`;


  /*
    10問正解
  */

  if (score === TOTAL_QUESTIONS) {
    resultIcon.textContent = "🏆";

    resultMessage.textContent =
      "パーフェクト！！ 九九マスターだ！";
  }


  /*
    8〜9問正解
  */

  else if (score >= 8) {
    resultIcon.textContent = "🎉";

    resultMessage.textContent =
      "すごい！ あとちょっとでパーフェクト！";
  }


  /*
    5〜7問正解
  */

  else if (score >= 5) {
    resultIcon.textContent = "😊";

    resultMessage.textContent =
      "いいかんじ！ もういちどやってみよう！";
  }


  /*
    0〜4問正解
  */

  else {
    resultIcon.textContent = "💪";

    resultMessage.textContent =
      "だいじょうぶ！ ゆっくりおぼえていこう！";
  }


  displayMistakes();
}


/* ------------------------------
   間違えた問題を表示
------------------------------ */

function displayMistakes() {
  mistakeList.innerHTML = "";


  /*
    全問正解
  */

  if (mistakes.length === 0) {
    mistakesArea.classList.add("hidden");

    return;
  }


  /*
    間違いあり
  */

  mistakesArea.classList.remove("hidden");


  mistakes.forEach((problem) => {
    const item =
      document.createElement("div");

    item.className =
      "mistake-item";

    item.textContent =
      `${problem.a} × ${problem.b} = ${problem.answer}`;

    mistakeList.appendChild(item);
  });
}


/* ------------------------------
   間違えた問題をもう一度
------------------------------ */

retryButton.addEventListener("click", () => {
  retryMode = true;


  /*
    間違えた問題だけを
    復習問題にする
  */

  questions = mistakes.map((problem) => ({
    a: problem.a,
    b: problem.b,
    answer: problem.answer
  }));


  /*
    復習用に初期化
  */

  currentIndex = 0;
  score = 0;
  history = [];


  showScreen(quizScreen);

  updateHistory();
  showQuestion();
});


/* ------------------------------
   最初に戻る
------------------------------ */

restartButton.addEventListener("click", () => {
  history = [];

  showScreen(startScreen);
});


backButton.addEventListener("click", () => {
  history = [];

  showScreen(startScreen);
});


/* ------------------------------
   ランダム整数
------------------------------ */

function randomNumber(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}


/* ------------------------------
   配列シャッフル
------------------------------ */

function shuffle(array) {
  const copiedArray = [...array];

  for (
    let i = copiedArray.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      copiedArray[i],
      copiedArray[j]
    ] = [
      copiedArray[j],
      copiedArray[i]
    ];
  }

  return copiedArray;
}


/* ------------------------------
   正解メッセージ
------------------------------ */

function randomCorrectMessage() {
  const messages = [
    "🎉 せいかい！",
    "⭐ すごい！",
    "😆 やったね！",
    "👏 そのちょうし！",
    "✨ ばっちり！"
  ];


  const index =
    Math.floor(
      Math.random() * messages.length
    );


  return messages[index];
}