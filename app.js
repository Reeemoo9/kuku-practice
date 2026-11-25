const TOTAL_RANDOM_QUESTIONS = 10;

const STORAGE_KEY =
  "kuku-study-history-v2";


/* =========================
   難易度設定
========================= */

const DIFFICULTIES = {

  easy: {
    label: "🌱 やさしい",
    icon: "🌱",
    seconds: 15,
    lives: 5
  },

  normal: {
    label: "⚔️ ふつう",
    icon: "⚔️",
    seconds: 10,
    lives: 3
  },

  hard: {
    label: "🔥 むずかしい",
    icon: "🔥",
    seconds: 5,
    lives: 2
  }

};


/* =========================
   DOM
========================= */

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

const mixButton =
  document.getElementById("mix-button");

const weakButton =
  document.getElementById("weak-button");

const statsButton =
  document.getElementById("stats-button");


const modeBackButton =
  document.getElementById("mode-back-button");

const modeTitle =
  document.getElementById("mode-title");

const practiceModeArea =
  document.getElementById("practice-mode-area");

const orderButton =
  document.getElementById("order-button");

const randomButton =
  document.getElementById("random-button");

const difficultyButtons =
  document.querySelectorAll(".difficulty-button");

const startBattleButton =
  document.getElementById("start-battle-button");


const backButton =
  document.getElementById("back-button");

const progress =
  document.getElementById("progress");

const difficultyLabel =
  document.getElementById("difficulty-label");


const heroBox =
  document.getElementById("hero-box");

const heroCharacter =
  document.getElementById("hero-character");

const heroLives =
  document.getElementById("hero-lives");

const monsterBox =
  document.getElementById("monster-box");

const monsterCharacter =
  document.getElementById("monster-character");

const monsterHpText =
  document.getElementById("monster-hp-text");

const monsterHpBar =
  document.getElementById("monster-hp-bar");

const battleEffect =
  document.getElementById("battle-effect");


const danLabel =
  document.getElementById("dan-label");

const timerText =
  document.getElementById("timer-text");

const timerValue =
  document.getElementById("timer-value");

const questionElement =
  document.getElementById("question");

const answerDisplay =
  document.getElementById("answer-display");

const message =
  document.getElementById("message");

const nextButton =
  document.getElementById("next-button");

const answerHistory =
  document.getElementById("answer-history");


const numberPad =
  document.getElementById("number-pad");

const numberKeys =
  document.querySelectorAll(".number-key");

const clearKey =
  document.getElementById("clear-key");

const decideKey =
  document.getElementById("decide-key");


const resultIcon =
  document.getElementById("result-icon");

const resultTitle =
  document.getElementById("result-title");

const resultMonster =
  document.getElementById("result-monster");

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


/* =========================
   状態
========================= */

let selectedDan = null;

let gameMode = "order";

let selectedDifficulty =
  "easy";

let questions = [];

let currentIndex = 0;

let score = 0;

let mistakes = [];

let history = [];

let currentAnswer = "";

let questionAnswered =
  false;

let retryMode =
  false;


/* バトル */

let heroLife =
  DIFFICULTIES.easy.lives;

let maxHeroLife =
  DIFFICULTIES.easy.lives;

let monsterHp = 0;

let monsterMaxHp = 0;


/* タイマー */

let timerId = null;

let timeLeft = 0;


/* =========================
   画面
========================= */

function showScreen(screen) {

  stopTimer();

  [
    startScreen,
    modeScreen,
    quizScreen,
    resultScreen,
    statsScreen
  ].forEach((item) => {

    item.classList.remove(
      "active"
    );

  });

  screen.classList.add(
    "active"
  );

  window.scrollTo(
    0,
    0
  );

}


/* =========================
   段選択
========================= */

danButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        selectedDan =
          Number(
            button.dataset.dan
          );

        gameMode =
          "order";

        modeTitle.textContent =
          `${selectedDan}のだん`;

        practiceModeArea.classList.remove(
          "hidden"
        );

        updatePracticeModeButtons();

        showModeScreen();

      }
    );

  }
);


/* =========================
   ごちゃまぜ
========================= */

mixButton.addEventListener(
  "click",
  () => {

    selectedDan = null;

    gameMode =
      "mix";

    modeTitle.textContent =
      "🔀 ごちゃまぜ";

    practiceModeArea.classList.add(
      "hidden"
    );

    showModeScreen();

  }
);


/* =========================
   苦手問題
========================= */

weakButton.addEventListener(
  "click",
  () => {

    const weak =
      createWeakQuestions();

    if (
      weak.length === 0
    ) {

      alert(
        "まだ にがてデータがないよ！\nまずは九九をれんしゅうしてみよう！"
      );

      return;

    }

    selectedDan =
      null;

    gameMode =
      "weak";

    modeTitle.textContent =
      "🔥 にがてもんだい";

    practiceModeArea.classList.add(
      "hidden"
    );

    showModeScreen();

  }
);


/* =========================
   コース画面
========================= */

function showModeScreen() {

  selectedDifficulty =
    "easy";

  updateDifficultyButtons();

  showScreen(
    modeScreen
  );

}

modeBackButton.addEventListener(
  "click",
  () => {

    showScreen(
      startScreen
    );

  }
);


/* =========================
   練習モード
========================= */

orderButton.addEventListener(
  "click",
  () => {

    gameMode =
      "order";

    updatePracticeModeButtons();

  }
);


randomButton.addEventListener(
  "click",
  () => {

    gameMode =
      "random";

    updatePracticeModeButtons();

  }
);


function updatePracticeModeButtons() {

  orderButton.classList.toggle(
    "selected",
    gameMode === "order"
  );

  randomButton.classList.toggle(
    "selected",
    gameMode === "random"
  );

}


/* =========================
   難易度
========================= */

difficultyButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        selectedDifficulty =
          button.dataset.difficulty;

        updateDifficultyButtons();

      }
    );

  }
);


function updateDifficultyButtons() {

  difficultyButtons.forEach(
    (button) => {

      button.classList.toggle(
        "selected",
        button.dataset.difficulty ===
          selectedDifficulty
      );

    }
  );

}


/* =========================
   START
========================= */

startBattleButton.addEventListener(
  "click",
  () => {

    if (
      gameMode === "weak"
    ) {

      questions =
        createWeakQuestions();

    }

    else {

      questions =
        createQuestions();

    }

    startBattle();

  }
);


/* =========================
   問題生成
========================= */

function createQuestions() {

  if (
    gameMode === "order"
  ) {

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


  if (
    gameMode === "random"
  ) {

    const values =
      shuffle([
        1,2,3,4,5,
        6,7,8,9
      ]);

    const result =
      [];

    for (
      let i = 0;
      i < TOTAL_RANDOM_QUESTIONS;
      i++
    ) {

      const b =
        i < 9
          ? values[i]
          : randomNumber(1,9);

      result.push({
        a: selectedDan,
        b: b,
        answer:
          selectedDan * b
      });

    }

    return result;

  }


  if (
    gameMode === "mix"
  ) {

    const result =
      [];

    for (
      let i = 0;
      i < TOTAL_RANDOM_QUESTIONS;
      i++
    ) {

      const a =
        randomNumber(2,9);

      const b =
        randomNumber(1,9);

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


/* =========================
   バトル開始
========================= */

function startBattle() {

  stopTimer();

  currentIndex = 0;
  score = 0;
  mistakes = [];
  history = [];

  currentAnswer = "";

  questionAnswered =
    false;

  retryMode =
    false;


  const difficulty =
    DIFFICULTIES[
      selectedDifficulty
    ];


  heroLife =
    difficulty.lives;

  maxHeroLife =
    difficulty.lives;


  /*
    全問題を解けば倒せる
  */

  monsterMaxHp =
    questions.length;

  monsterHp =
    monsterMaxHp;


  difficultyLabel.textContent =
    difficulty.icon;


  updateBattleStatus();


  showScreen(
    quizScreen
  );


  updateHistory();

  showQuestion();

}


/* =========================
   問題表示
========================= */

function showQuestion() {

  stopTimer();

  const q =
    questions[currentIndex];


  currentAnswer =
    "";

  questionAnswered =
    false;


  progress.textContent =
    `${currentIndex + 1} / ${questions.length}`;


  questionElement.textContent =
    `${q.a} × ${q.b} = ?`;


  /*
    ラベル
  */

  if (retryMode) {

    danLabel.textContent =
      "🔥 もういちど！";

  }

  else if (
    gameMode === "mix"
  ) {

    danLabel.textContent =
      "🔀 ごちゃまぜ";

  }

  else if (
    gameMode === "weak"
  ) {

    danLabel.textContent =
      "🔥 にがてもんだい";

  }

  else if (
    gameMode === "order"
  ) {

    danLabel.textContent =
      `${selectedDan}のだん・じゅんばん`;

  }

  else {

    danLabel.textContent =
      `${selectedDan}のだん・ランダム`;

  }


  answerDisplay.textContent =
    "?";

  answerDisplay.className =
    "answer-display empty";


  message.textContent =
    "";

  message.className =
    "message";


  battleEffect.textContent =
    "";


  nextButton.classList.add(
    "hidden"
  );


  numberPad.classList.remove(
    "hidden"
  );


  startTimer();

}


/* =========================
   テンキー
========================= */

numberKeys.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        if (
          questionAnswered
        ) {

          return;

        }


        if (
          currentAnswer.length >= 2
        ) {

          return;

        }


        const number =
          button.dataset.number;


        if (
          currentAnswer === "" &&
          number === "0"
        ) {

          return;

        }


        currentAnswer +=
          number;


        updateAnswerDisplay();

      }
    );

  }
);


clearKey.addEventListener(
  "click",
  () => {

    if (
      questionAnswered
    ) {

      return;

    }

    currentAnswer =
      currentAnswer.slice(
        0,
        -1
      );

    updateAnswerDisplay();

  }
);


decideKey.addEventListener(
  "click",
  () => {

    if (
      questionAnswered
    ) {

      return;

    }

    checkAnswer(
      false
    );

  }
);


/* =========================
   回答表示
========================= */

function updateAnswerDisplay() {

  if (
    currentAnswer === ""
  ) {

    answerDisplay.textContent =
      "?";

    answerDisplay.className =
      "answer-display empty";

  }

  else {

    answerDisplay.textContent =
      currentAnswer;

    answerDisplay.className =
      "answer-display";

  }

}


/* =========================
   タイマー
========================= */

function startTimer() {

  stopTimer();


  const seconds =
    DIFFICULTIES[
      selectedDifficulty
    ].seconds;


  timeLeft =
    seconds;


  updateTimerDisplay(
    seconds
  );


  timerId =
    setInterval(
      () => {

        timeLeft--;


        updateTimerDisplay(
          seconds
        );


        if (
          timeLeft <= 0
        ) {

          stopTimer();

          checkAnswer(
            true
          );

        }

      },
      1000
    );

}


function stopTimer() {

  if (
    timerId !== null
  ) {

    clearInterval(
      timerId
    );

    timerId =
      null;

  }

}


function updateTimerDisplay(
  totalSeconds
) {

  timerText.textContent =
    `⏱️ ${Math.max(0,timeLeft)}`;


  const rate =
    Math.max(
      0,
      timeLeft /
      totalSeconds
    );


  timerValue.style.width =
    `${rate * 100}%`;


  timerValue.classList.remove(
    "warning",
    "danger"
  );


  if (
    rate <= .3
  ) {

    timerValue.classList.add(
      "danger"
    );

  }

  else if (
    rate <= .6
  ) {

    timerValue.classList.add(
      "warning"
    );

  }

}


/* =========================
   答え合わせ
========================= */

function checkAnswer(
  timeOut
) {

  if (
    questionAnswered
  ) {

    return;

  }


  if (
    !timeOut &&
    currentAnswer === ""
  ) {

    message.textContent =
      "こたえを いれてね！";

    message.className =
      "message wrong";

    return;

  }


  stopTimer();


  questionAnswered =
    true;


  const q =
    questions[currentIndex];


  const userAnswer =
    timeOut
      ? null
      : Number(currentAnswer);


  const isCorrect =
    !timeOut &&
    userAnswer ===
      q.answer;


  /*
    必ず1問分モンスターHP減少
  */

  monsterHp =
    Math.max(
      0,
      monsterHp - 1
    );


  if (
    isCorrect
  ) {

    score++;

    history.push(
      true
    );


    message.textContent =
      randomCorrectMessage();


    message.className =
      "message correct";


    answerDisplay.classList.add(
      "answered-correct"
    );


    heroAttack();

  }

  else {

    history.push(
      false
    );


    heroLife =
      Math.max(
        0,
        heroLife - 1
      );


    if (timeOut) {

      answerDisplay.textContent =
        q.answer;


      answerDisplay.className =
        "answer-display answered-wrong";


      message.textContent =
        `⏰ じかんぎれ！ こたえは ${q.answer}！`;

    }

    else {

      answerDisplay.classList.add(
        "answered-wrong"
      );


      message.textContent =
        `おしい！ こたえは ${q.answer} だよ！`;

    }


    message.className =
      "message wrong";


    monsterAttack();


    if (!retryMode) {

      mistakes.push({

        ...q,

        userAnswer:
          userAnswer

      });

    }

  }


  saveStudyResult({

    a:
      q.a,

    b:
      q.b,

    answer:
      q.answer,

    userAnswer:
      userAnswer,

    correct:
      isCorrect,

    mode:
      retryMode
        ? "retry"
        : gameMode,

    difficulty:
      selectedDifficulty,

    timeout:
      timeOut,

    date:
      new Date().toISOString()

  });


  updateBattleStatus();

  updateHistory();


  numberPad.classList.add(
    "hidden"
  );


  nextButton.classList.remove(
    "hidden"
  );


  if (
    currentIndex ===
    questions.length - 1
  ) {

    nextButton.textContent =
      "モンスターをたおす！ ⚔️";

  }

  else {

    nextButton.textContent =
      "つぎのもんだい →";

  }

}


/* =========================
   バトル表示
========================= */

function updateBattleStatus() {

  let lifeText =
    "";


  for (
    let i = 0;
    i < maxHeroLife;
    i++
  ) {

    lifeText +=
      i < heroLife
        ? "❤️"
        : "♡";

  }


  heroLives.textContent =
    lifeText;


  monsterHpText.textContent =
    `${monsterHp} / ${monsterMaxHp}`;


  const hpRate =
    monsterMaxHp === 0
      ? 0
      : monsterHp /
        monsterMaxHp;


  monsterHpBar.style.width =
    `${hpRate * 100}%`;

}


/* =========================
   攻撃演出
========================= */

function heroAttack() {

  heroCharacter.classList.remove(
    "hero-attack"
  );

  monsterCharacter.classList.remove(
    "damage"
  );


  void heroCharacter.offsetWidth;


  heroCharacter.classList.add(
    "hero-attack"
  );


  battleEffect.textContent =
    "⚔️💥";


  setTimeout(
    () => {

      monsterCharacter.classList.add(
        "damage"
      );

    },
    170
  );

}


function monsterAttack() {

  monsterCharacter.classList.remove(
    "monster-attack"
  );

  heroCharacter.classList.remove(
    "damage"
  );


  void monsterCharacter.offsetWidth;


  monsterCharacter.classList.add(
    "monster-attack"
  );


  battleEffect.textContent =
    "💥";


  setTimeout(
    () => {

      heroCharacter.classList.add(
        "damage"
      );

    },
    170
  );

}


/* =========================
   履歴
========================= */

function updateHistory() {

  answerHistory.innerHTML =
    "";


  for (
    let i = 0;
    i < questions.length;
    i++
  ) {

    const mark =
      document.createElement(
        "span"
      );


    mark.classList.add(
      "history-mark"
    );


    if (
      i < history.length
    ) {

      if (
        history[i]
      ) {

        mark.textContent =
          "〇";


        mark.classList.add(
          "correct"
        );

      }

      else {

        mark.textContent =
          "×";


        mark.classList.add(
          "wrong"
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


/* =========================
   NEXT
========================= */

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


/* =========================
   結果
========================= */

function showResult() {

  stopTimer();


  showScreen(
    resultScreen
  );


  resultIcon.textContent =
    "🏆";


  resultTitle.textContent =
    "モンスターを たおした！";


  resultMonster.textContent =
    "👾💥";


  resultScore.textContent =
    `${questions.length}もんちゅう ${score}もん せいかい！`;


  const rate =
    questions.length === 0
      ? 0
      : score /
        questions.length;


  if (
    rate === 1
  ) {

    resultMessage.textContent =
      "パーフェクト！ さいきょうの ぼうけんしゃだ！";

  }

  else if (
    rate >= .8
  ) {

    resultMessage.textContent =
      "すごい！ モンスターをやっつけた！";

  }

  else if (
    heroLife > 0
  ) {

    resultMessage.textContent =
      "やったね！ さいごまで よくがんばった！";

  }

  else {

    resultMessage.textContent =
      "ライフがなくなっても さいごまで がんばったね！";

  }


  displayMistakes();

}


/* =========================
   間違い
========================= */

function displayMistakes() {

  mistakeList.innerHTML =
    "";


  if (
    retryMode ||
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


/* =========================
   復習
========================= */

retryButton.addEventListener(
  "click",
  () => {

    questions =
      mistakes.map(
        (problem) => ({

          a:
            problem.a,

          b:
            problem.b,

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

    currentAnswer =
      "";

    questionAnswered =
      false;


    const difficulty =
      DIFFICULTIES[
        selectedDifficulty
      ];


    heroLife =
      difficulty.lives;

    maxHeroLife =
      difficulty.lives;


    monsterMaxHp =
      questions.length;

    monsterHp =
      monsterMaxHp;


    updateBattleStatus();


    showScreen(
      quizScreen
    );


    updateHistory();

    showQuestion();

  }
);


/* =========================
   戻る
========================= */

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

    stopTimer();

    showScreen(
      startScreen
    );

  }
);


/* =========================
   localStorage
========================= */

function saveStudyResult(
  result
) {

  const data =
    getStudyHistory();


  data.push(
    result
  );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

}


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
      JSON.parse(
        text
      );


    return Array.isArray(data)
      ? data
      : [];

  }

  catch (error) {

    console.error(
      "学習記録エラー",
      error
    );


    return [];

  }

}


/* =========================
   統計画面
========================= */

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


function renderStats() {

  const data =
    getStudyHistory();


  renderDanStats(
    data
  );


  renderHeatmap(
    data
  );

}


/* =========================
   段別集計
========================= */

function renderDanStats(
  data
) {

  danStats.innerHTML =
    "";


  for (
    let dan = 2;
    dan <= 9;
    dan++
  ) {

    const attempts =
      data.filter(
        item =>
          item.a === dan
      );


    const total =
      attempts.length;


    const correct =
      attempts.filter(
        item =>
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


    const name =
      document.createElement(
        "span"
      );


    name.textContent =
      `${dan}の段`;


    const rateArea =
      document.createElement(
        "span"
      );


    rateArea.className =
      "stat-rate";


    const text =
      document.createElement(
        "span"
      );


    text.textContent =
      rate === null
        ? "－"
        : `${rate}%`;


    const dot =
      document.createElement(
        "i"
      );


    dot.className =
      `rate-dot ${getRateClass(rate)}`;


    rateArea.append(
      text,
      dot
    );


    const count =
      document.createElement(
        "span"
      );


    count.textContent =
      `${total}回`;


    row.append(
      name,
      rateArea,
      count
    );


    danStats.appendChild(
      row
    );

  }

}


/* =========================
   ヒートマップ
========================= */

function renderHeatmap(
  data
) {

  heatmap.innerHTML =
    "";


  addHeatLabel(
    "×"
  );


  for (
    let b = 1;
    b <= 9;
    b++
  ) {

    addHeatLabel(
      String(b)
    );

  }


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
          item =>
            item.a === a &&
            item.b === b
        );


      const total =
        attempts.length;


      const correct =
        attempts.filter(
          item =>
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


      if (
        rate === null
      ) {

        cell.classList.add(
          "heat-none"
        );

        cell.textContent =
          "－";

      }

      else if (
        rate >= 80
      ) {

        cell.classList.add(
          "heat-excellent"
        );

        cell.textContent =
          `${rate}%`;

      }

      else if (
        rate >= 50
      ) {

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
          ? `${a}×${b} 未挑戦`
          : `${a}×${b} ${rate}% (${correct}/${total})`;


      heatmap.appendChild(
        cell
      );

    }

  }

}


function addHeatLabel(
  text
) {

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


function getRateClass(
  rate
) {

  if (
    rate === null
  ) {

    return "none";

  }


  if (
    rate >= 80
  ) {

    return "excellent";

  }


  if (
    rate >= 50
  ) {

    return "medium";

  }


  return "weak";

}


/* =========================
   苦手問題
========================= */

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
          item =>
            item.a === a &&
            item.b === b
        );


      if (
        attempts.length === 0
      ) {

        continue;

      }


      const correct =
        attempts.filter(
          item =>
            item.correct
        ).length;


      stats.push({

        a: a,

        b: b,

        answer:
          a * b,

        rate:
          correct /
          attempts.length,

        attempts:
          attempts.length

      });

    }

  }


  stats.sort(
    (x,y) => {

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


  return stats
    .slice(
      0,
      TOTAL_RANDOM_QUESTIONS
    )
    .map(
      item => ({

        a:
          item.a,

        b:
          item.b,

        answer:
          item.answer

      })
    );

}


/* =========================
   記録リセット
========================= */

clearStatsButton.addEventListener(
  "click",
  () => {

    const ok =
      confirm(
        "これまでの がくしゅうきろくを\nぜんぶ けしてもいい？"
      );


    if (!ok) {

      return;

    }


    localStorage.removeItem(
      STORAGE_KEY
    );


    renderStats();

  }
);


/* =========================
   Utilities
========================= */

function randomNumber(
  min,
  max
) {

  return Math.floor(
    Math.random() *
    (max - min + 1)
  ) + min;

}


function shuffle(
  array
) {

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


function randomCorrectMessage() {

  const messages = [
    "⚔️ せいかい！ こうげき！",
    "💥 クリティカル！",
    "⭐ すごい！",
    "🔥 ナイスこうげき！",
    "✨ ばっちり！"
  ];


  return messages[
    Math.floor(
      Math.random() *
      messages.length
    )
  ];

}