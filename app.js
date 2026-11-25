const TOTAL_RANDOM_QUESTIONS = 10;
const STORAGE_KEY = "kuku-study-history-v2";


/* ==============================
   DOM
============================== */

const startScreen =
  document.getElementById("start-screen");

const modeScreen =
  document.getElementById("mode-screen");

const quizScreen =
  document.getElementById("quiz-screen");

const resultScreen =
  document.getElementById("result-screen");

const statsScreen =
  document.getElementById("stats-screen");


const danButtons =
  document.querySelectorAll(".dan-button");


const modeBackButton =
  document.getElementById("mode-back-button");

const modeTitle =
  document.getElementById("mode-title");

const orderButton =
  document.getElementById("order-button");

const randomButton =
  document.getElementById("random-button");


const mixButton =
  document.getElementById("mix-button");

const weakButton =
  document.getElementById("weak-button");

const statsButton =
  document.getElementById("stats-button");


const backButton =
  document.getElementById("back-button");

const progress =
  document.getElementById("progress");

const scoreDisplay =
  document.getElementById("score");

const danLabel =
  document.getElementById("dan-label");

const questionElement =
  document.getElementById("question");

const answerForm =
  document.getElementById("answer-form");

const answerInput =
  document.getElementById("answer");

const message =
  document.getElementById("message");

const nextButton =
  document.getElementById("next-button");

const answerHistory =
  document.getElementById("answer-history");


const resultIcon =
  document.getElementById("result-icon");

const resultScore =
  document.getElementById("result-score");

const resultMessage =
  document.getElementById("result-message");

const mistakesArea =
  document.getElementById("mistakes-area");

const mistakeList =
  document.getElementById("mistake-list");

const retryButton =
  document.getElementById("retry-button");

const restartButton =
  document.getElementById("restart-button");


const statsBackButton =
  document.getElementById("stats-back-button");

const danStats =
  document.getElementById("dan-stats");

const heatmap =
  document.getElementById("heatmap");

const clearStatsButton =
  document.getElementById("clear-stats-button");


/* ==============================
   状態
============================== */

let selectedDan = null;

let gameMode = null;

let questions = [];

let currentIndex = 0;

let score = 0;

let mistakes = [];

let history = [];

let retryMode = false;


/* ==============================
   画面切替
============================== */

function showScreen(screen) {

  [
    startScreen,
    modeScreen,
    quizScreen,
    resultScreen,
    statsScreen
  ].forEach((item) => {

    item.classList.remove("active");

  });


  screen.classList.add("active");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* ==============================
   数字入力制御
============================== */

answerInput.addEventListener(
  "input",
  () => {

    answerInput.value =
      answerInput.value
        .replace(/[^0-9]/g, "")
        .slice(0, 2);

  }
);


/* ==============================
   段選択
============================== */

danButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      selectedDan =
        Number(button.dataset.dan);

      modeTitle.textContent =
        `${selectedDan}のだん`;

      showScreen(modeScreen);

    }
  );

});


/* ==============================
   モード選択
============================== */

orderButton.addEventListener(
  "click",
  () => {

    gameMode = "order";

    startGame();

  }
);


randomButton.addEventListener(
  "click",
  () => {

    gameMode = "random";

    startGame();

  }
);


modeBackButton.addEventListener(
  "click",
  () => {

    showScreen(startScreen);

  }
);


/* ==============================
   ごちゃまぜ
============================== */

mixButton.addEventListener(
  "click",
  () => {

    selectedDan = null;

    gameMode = "mix";

    startGame();

  }
);


/* ==============================
   苦手問題
============================== */

weakButton.addEventListener(
  "click",
  () => {

    const weakQuestions =
      createWeakQuestions();


    if (weakQuestions.length === 0) {

      alert(
        "まだ にがてデータがないよ！\nまずは九九をれんしゅうしてみよう！"
      );

      return;

    }


    selectedDan = null;

    gameMode = "weak";

    questions = weakQuestions;

    resetGameState();

    showScreen(quizScreen);

    updateHistory();

    showQuestion();

  }
);


/* ==============================
   ゲーム開始
============================== */

function startGame() {

  questions =
    createQuestions();

  resetGameState();

  showScreen(quizScreen);

  updateHistory();

  showQuestion();

}


/* ==============================
   ゲーム状態初期化
============================== */

function resetGameState() {

  currentIndex = 0;

  score = 0;

  mistakes = [];

  history = [];

  retryMode = false;

}


/* ==============================
   問題生成
============================== */

function createQuestions() {

  /*
    順番
    ×1 ～ ×9
  */

  if (gameMode === "order") {

    return Array.from(
      { length: 9 },
      (_, index) => {

        const b =
          index + 1;

        return {

          a: selectedDan,

          b: b,

          answer:
            selectedDan * b

        };

      }
    );

  }


  /*
    段別ランダム
  */

  if (gameMode === "random") {

    const values =
      shuffle([
        1, 2, 3, 4, 5,
        6, 7, 8, 9
      ]);


    const result = [];


    for (
      let i = 0;
      i < TOTAL_RANDOM_QUESTIONS;
      i++
    ) {

      const b =
        i < 9
          ? values[i]
          : randomNumber(1, 9);


      result.push({

        a: selectedDan,

        b: b,

        answer:
          selectedDan * b

      });

    }


    return result;

  }


  /*
    ごちゃまぜ
  */

  if (gameMode === "mix") {

    const result = [];


    for (
      let i = 0;
      i < TOTAL_RANDOM_QUESTIONS;
      i++
    ) {

      const a =
        randomNumber(2, 9);

      const b =
        randomNumber(1, 9);


      result.push({

        a: a,

        b: b,

        answer:
          a * b

      });

    }


    return result;

  }


  return [];

}


/* ==============================
   問題表示
============================== */

function showQuestion() {

  const currentQuestion =
    questions[currentIndex];


  progress.textContent =
    `${currentIndex + 1} / ${questions.length}`;


  scoreDisplay.textContent =
    `⭐ ${score}`;


  /*
    ラベル
  */

  if (retryMode) {

    danLabel.textContent =
      "🔥 もういちど！";

  }

  else if (gameMode === "mix") {

    danLabel.textContent =
      "🔀 ごちゃまぜ";

  }

  else if (gameMode === "weak") {

    danLabel.textContent =
      "🔥 にがてもんだい";

  }

  else if (gameMode === "order") {

    danLabel.textContent =
      `${selectedDan}のだん・じゅんばん`;

  }

  else {

    danLabel.textContent =
      `${selectedDan}のだん・ランダム`;

  }


  questionElement.textContent =
    `${currentQuestion.a} × ${currentQuestion.b} = ?`;


  answerInput.value = "";

  answerInput.disabled = false;


  message.textContent = "";

  message.className =
    "message";


  nextButton.classList.add(
    "hidden"
  );


  /*
    PCでは自動フォーカス
  */

  if (
    !window.matchMedia(
      "(pointer: coarse)"
    ).matches
  ) {

    setTimeout(
      () => {

        answerInput.focus();

      },
      100
    );

  }

}


/* ==============================
   Enter / 完了
============================== */

answerForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    checkAnswer();

  }
);


/* ==============================
   答え合わせ
============================== */

function checkAnswer() {

  const currentQuestion =
    questions[currentIndex];


  const inputValue =
    answerInput.value.trim();


  if (inputValue === "") {

    message.textContent =
      "こたえを いれてね！";

    message.className =
      "message wrong";

    answerInput.focus();

    return;

  }


  const userAnswer =
    Number(inputValue);


  const isCorrect =
    userAnswer ===
    currentQuestion.answer;


  /*
    正解
  */

  if (isCorrect) {

    score++;

    history.push(true);

    message.textContent =
      randomCorrectMessage();

    message.className =
      "message correct";

  }


  /*
    不正解
  */

  else {

    history.push(false);


    message.textContent =
      `おしい！ こたえは ${currentQuestion.answer} だよ！`;


    message.className =
      "message wrong";


    if (!retryMode) {

      mistakes.push({

        ...currentQuestion,

        userAnswer:
          userAnswer

      });

    }

  }


  /*
    学習履歴保存
    復習問題も回答実績として保存
  */

  saveStudyResult({

    a: currentQuestion.a,

    b: currentQuestion.b,

    answer:
      currentQuestion.answer,

    userAnswer:
      userAnswer,

    correct:
      isCorrect,

    mode:
      retryMode
        ? "retry"
        : gameMode,

    date:
      new Date().toISOString()

  });


  updateHistory();


  scoreDisplay.textContent =
    `⭐ ${score}`;


  answerInput.disabled =
    true;


  nextButton.classList.remove(
    "hidden"
  );


  if (
    currentIndex ===
    questions.length - 1
  ) {

    nextButton.textContent =
      "けっかをみる！ 🎉";

  }

  else {

    nextButton.textContent =
      "つぎのもんだい →";

  }

}


/* ==============================
   〇×履歴
============================== */

function updateHistory() {

  answerHistory.innerHTML =
    "";


  const totalMarks =
    questions.length;


  for (
    let i = 0;
    i < totalMarks;
    i++
  ) {

    const mark =
      document.createElement("span");


    mark.classList.add(
      "history-mark"
    );


    if (i < history.length) {

      if (history[i]) {

        mark.textContent =
          "〇";

        mark.classList.add(
          "correct"
        );

        mark.setAttribute(
          "aria-label",
          `${i + 1}問目 正解`
        );

      }

      else {

        mark.textContent =
          "×";

        mark.classList.add(
          "wrong"
        );

        mark.setAttribute(
          "aria-label",
          `${i + 1}問目 不正解`
        );

      }

    }

    else {

      mark.textContent =
        "・";

      mark.classList.add(
        "empty"
      );

    }


    answerHistory.appendChild(
      mark
    );

  }

}


/* ==============================
   次
============================== */

nextButton.addEventListener(
  "click",
  () => {

    currentIndex++;


    if (
      currentIndex >=
      questions.length
    ) {

      showResult();

      return;

    }


    showQuestion();

  }
);


/* ==============================
   結果
============================== */

function showResult() {

  showScreen(
    resultScreen
  );


  if (retryMode) {

    resultIcon.textContent =
      "🔥";


    resultScore.textContent =
      `${questions.length}もん おわったよ！`;


    resultMessage.textContent =
      "にがてなもんだいに ちょうせんできたね！";


    mistakesArea.classList.add(
      "hidden"
    );


    return;

  }


  resultScore.textContent =
    `${questions.length}もんちゅう ${score}もん せいかい！`;


  const rate =
    score / questions.length;


  if (rate === 1) {

    resultIcon.textContent =
      "🏆";

    resultMessage.textContent =
      "パーフェクト！！ 九九マスターだ！";

  }

  else if (rate >= 0.8) {

    resultIcon.textContent =
      "🎉";

    resultMessage.textContent =
      "すごい！ あとちょっとでパーフェクト！";

  }

  else if (rate >= 0.5) {

    resultIcon.textContent =
      "😊";

    resultMessage.textContent =
      "いいかんじ！ もういちどやってみよう！";

  }

  else {

    resultIcon.textContent =
      "💪";

    resultMessage.textContent =
      "だいじょうぶ！ ゆっくりおぼえていこう！";

  }


  displayMistakes();

}


/* ==============================
   間違い表示
============================== */

function displayMistakes() {

  mistakeList.innerHTML =
    "";


  if (
    mistakes.length === 0
  ) {

    mistakesArea.classList.add(
      "hidden"
    );

    return;

  }


  mistakesArea.classList.remove(
    "hidden"
  );


  mistakes.forEach(
    (problem) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "mistake-item";


      item.textContent =
        `${problem.a} × ${problem.b} = ${problem.answer}`;


      mistakeList.appendChild(
        item
      );

    }
  );

}


/* ==============================
   間違い復習
============================== */

retryButton.addEventListener(
  "click",
  () => {

    questions =
      mistakes.map(
        (problem) => ({

          a: problem.a,

          b: problem.b,

          answer:
            problem.answer

        })
      );


    retryMode =
      true;


    currentIndex =
      0;

    score =
      0;

    history =
      [];


    showScreen(
      quizScreen
    );


    updateHistory();

    showQuestion();

  }
);


/* ==============================
   戻る
============================== */

restartButton.addEventListener(
  "click",
  () => {

    showScreen(
      startScreen
    );

  }
);


backButton.addEventListener(
  "click",
  () => {

    showScreen(
      startScreen
    );

  }
);


/* ==============================
   localStorage 保存
============================== */

function saveStudyResult(result) {

  const data =
    getStudyHistory();


  data.push(result);


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

}


/* ==============================
   localStorage 読込
============================== */

function getStudyHistory() {

  try {

    const text =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!text) {

      return [];

    }


    const data =
      JSON.parse(text);


    return Array.isArray(data)
      ? data
      : [];

  }

  catch (error) {

    console.error(
      "学習記録の読み込みに失敗しました。",
      error
    );


    return [];

  }

}


/* ==============================
   学習記録表示
============================== */

statsButton.addEventListener(
  "click",
  () => {

    renderStats();

    showScreen(
      statsScreen
    );

  }
);


statsBackButton.addEventListener(
  "click",
  () => {

    showScreen(
      startScreen
    );

  }
);


/* ==============================
   統計全体
============================== */

function renderStats() {

  const data =
    getStudyHistory();


  renderDanStats(data);

  renderHeatmap(data);

}


/* ==============================
   段別統計
============================== */

function renderDanStats(data) {

  danStats.innerHTML =
    "";


  for (
    let dan = 2;
    dan <= 9;
    dan++
  ) {

    const attempts =
      data.filter(
        (item) =>
          item.a === dan
      );


    const total =
      attempts.length;


    const correct =
      attempts.filter(
        (item) =>
          item.correct
      ).length;


    const rate =
      total === 0
        ? null
        : Math.round(
            correct /
            total *
            100
          );


    const row =
      document.createElement(
        "div"
      );


    row.className =
      "dan-stat-row";


    const danText =
      document.createElement(
        "span"
      );


    danText.textContent =
      `${dan}の段`;


    const rateArea =
      document.createElement(
        "span"
      );


    rateArea.className =
      "stat-rate";


    const rateText =
      document.createElement(
        "span"
      );


    rateText.textContent =
      rate === null
        ? "－"
        : `${rate}%`;


    const dot =
      document.createElement(
        "i"
      );


    dot.className =
      `rate-dot ${getRateClass(rate)}`;


    rateArea.appendChild(
      rateText
    );


    rateArea.appendChild(
      dot
    );


    const count =
      document.createElement(
        "span"
      );


    count.textContent =
      `${total}回`;


    row.appendChild(
      danText
    );


    row.appendChild(
      rateArea
    );


    row.appendChild(
      count
    );


    danStats.appendChild(
      row
    );

  }

}


/* ==============================
   ヒートマップ
============================== */

function renderHeatmap(data) {

  heatmap.innerHTML =
    "";


  /*
    左上
  */

  addHeatLabel("×");


  /*
    横軸
  */

  for (
    let b = 1;
    b <= 9;
    b++
  ) {

    addHeatLabel(
      String(b)
    );

  }


  /*
    2〜9の段
  */

  for (
    let a = 2;
    a <= 9;
    a++
  ) {

    addHeatLabel(
      String(a)
    );


    for (
      let b = 1;
      b <= 9;
      b++
    ) {

      const attempts =
        data.filter(
          (item) =>
            item.a === a &&
            item.b === b
        );


      const total =
        attempts.length;


      const correct =
        attempts.filter(
          (item) =>
            item.correct
        ).length;


      const rate =
        total === 0
          ? null
          : Math.round(
              correct /
              total *
              100
            );


      const cell =
        document.createElement(
          "div"
        );


      cell.classList.add(
        "heat-cell"
      );


      if (rate === null) {

        cell.classList.add(
          "heat-none"
        );

        cell.textContent =
          "－";

      }

      else if (rate >= 80) {

        cell.classList.add(
          "heat-excellent"
        );

        cell.textContent =
          `${rate}%`;

      }

      else if (rate >= 50) {

        cell.classList.add(
          "heat-medium"
        );

        cell.textContent =
          `${rate}%`;

      }

      else {

        cell.classList.add(
          "heat-weak"
        );

        cell.textContent =
          `${rate}%`;

      }


      cell.title =
        total === 0

          ? `${a} × ${b}：未挑戦`

          : `${a} × ${b}：${rate}%（${correct}/${total}）`;


      heatmap.appendChild(
        cell
      );

    }

  }

}


/* ==============================
   ヒートマップ見出し
============================== */

function addHeatLabel(text) {

  const cell =
    document.createElement(
      "div"
    );


  cell.className =
    "heat-cell heat-label";


  cell.textContent =
    text;


  heatmap.appendChild(
    cell
  );

}


/* ==============================
   色判定
============================== */

function getRateClass(rate) {

  if (rate === null) {

    return "none";

  }


  if (rate >= 80) {

    return "excellent";

  }


  if (rate >= 50) {

    return "medium";

  }


  return "weak";

}


/* ==============================
   苦手問題作成
============================== */

function createWeakQuestions() {

  const data =
    getStudyHistory();


  const stats =
    [];


  for (
    let a = 2;
    a <= 9;
    a++
  ) {

    for (
      let b = 1;
      b <= 9;
      b++
    ) {

      const attempts =
        data.filter(
          (item) =>
            item.a === a &&
            item.b === b
        );


      /*
        一度も解いていない問題は
        苦手判定しない
      */

      if (
        attempts.length === 0
      ) {

        continue;

      }


      const correct =
        attempts.filter(
          (item) =>
            item.correct
        ).length;


      const rate =
        correct /
        attempts.length;


      stats.push({

        a: a,

        b: b,

        answer:
          a * b,

        rate: rate,

        attempts:
          attempts.length

      });

    }

  }


  /*
    正答率が低い順
    同率なら挑戦回数が多い順
  */

  stats.sort(
    (x, y) => {

      if (
        x.rate !== y.rate
      ) {

        return (
          x.rate -
          y.rate
        );

      }


      return (
        y.attempts -
        x.attempts
      );

    }
  );


  /*
    最大10問
  */

  return stats
    .slice(
      0,
      TOTAL_RANDOM_QUESTIONS
    )
    .map(
      (item) => ({

        a: item.a,

        b: item.b,

        answer:
          item.answer

      })
    );

}


/* ==============================
   記録リセット
============================== */

clearStatsButton.addEventListener(
  "click",
  () => {

    const result =
      confirm(
        "これまでの がくしゅうきろくを\nぜんぶ けしてもいい？"
      );


    if (!result) {

      return;

    }


    localStorage.removeItem(
      STORAGE_KEY
    );


    renderStats();

  }
);


/* ==============================
   数値ランダム
============================== */

function randomNumber(
  min,
  max
) {

  return Math.floor(
    Math.random() *
    (max - min + 1)
  ) + min;

}


/* ==============================
   配列シャッフル
============================== */

function shuffle(array) {

  const result =
    [...array];


  for (
    let i =
      result.length - 1;

    i > 0;

    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    [
      result[i],
      result[j]
    ] = [
      result[j],
      result[i]
    ];

  }


  return result;

}


/* ==============================
   正解メッセージ
============================== */

function randomCorrectMessage() {

  const messages = [

    "🎉 せいかい！",

    "⭐ すごい！",

    "😆 やったね！",

    "👏 そのちょうし！",

    "✨ ばっちり！"

  ];


  return messages[
    Math.floor(
      Math.random() *
      messages.length
    )
  ];

}