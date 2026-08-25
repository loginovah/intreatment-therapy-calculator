"use client";

import { useMemo, useState } from "react";

type Option = {
  label: string;
  value: string;
  score?: number;
  description?: string;
};

type Question = {
  id: string;
  eyebrow: string;
  title: string;
  note?: string;
  options: Option[];
};

type Answers = Record<string, Option>;

const questions: Question[] = [
  {
    id: "goal",
    eyebrow: "Желаемый результат",
    title: "Что вы хотели бы получить от работы?",
    options: [
      {
        label: "Разобраться в одной ситуации",
        value: "single-situation",
        score: 0,
        description: "Принять решение, подготовиться к разговору, увидеть возможные действия.",
      },
      {
        label: "Справиться с конкретным переживанием или симптомом",
        value: "specific-symptom",
        score: 1,
        description: "Стать спокойнее и получить новые способы поддерживать себя.",
      },
      {
        label: "Устойчиво изменить повторяющийся сценарий",
        value: "recurring-pattern",
        score: 2,
        description: "Не только почувствовать облегчение, но и изменить привычный способ действия.",
      },
      {
        label: "Добиться глубоких изменений в нескольких сферах жизни",
        value: "systemic-change",
        score: 3,
        description: "Перестроить отношения с собой и людьми, укрепить внутренние опоры.",
      },
    ],
  },
  {
    id: "duration",
    eyebrow: "Давность",
    title: "Как давно эта трудность присутствует в вашей жизни?",
    options: [
      { label: "Возникла недавно и впервые", value: "new", score: 0 },
      { label: "От одного до шести месяцев", value: "months", score: 1 },
      { label: "Больше полугода или периодически возвращается", value: "recurring", score: 2 },
      { label: "Несколько лет или столько, сколько я себя помню", value: "long-term", score: 3 },
    ],
  },
  {
    id: "breadth",
    eyebrow: "Ширина влияния",
    title: "Насколько широко эта трудность влияет на вашу жизнь?",
    options: [
      { label: "Касается одной конкретной ситуации", value: "situation", score: 0 },
      { label: "Влияет преимущественно на одну сферу", value: "one-area", score: 1 },
      { label: "Проявляется в двух-трёх сферах", value: "several-areas", score: 2 },
      { label: "Отражается почти на всей жизни", value: "whole-life", score: 3 },
    ],
  },
  {
    id: "impact",
    eyebrow: "Повседневная жизнь",
    title: "Насколько эта трудность мешает вам жить сейчас?",
    options: [
      { label: "Мне неприятно или трудно, но в целом я справляюсь", value: "coping", score: 0 },
      { label: "Иногда заметно влияет на состояние и решения", value: "sometimes", score: 1 },
      { label: "Регулярно мешает работе, сну, отношениям или делам", value: "regularly", score: 2 },
      { label: "Мне трудно поддерживать привычную жизнь", value: "serious", score: 3 },
    ],
  },
  {
    id: "regulation",
    eyebrow: "Восстановление",
    title: "Когда состояние ухудшается, насколько легко вам вернуть равновесие?",
    options: [
      { label: "Обычно я восстанавливаюсь достаточно быстро", value: "quickly", score: 0 },
      { label: "Мне требуется время или помощь близких", value: "support", score: 1 },
      { label: "Я могу на несколько дней или недель выпадать из жизни", value: "days-weeks", score: 2 },
      { label: "Мне часто сложно управлять состоянием, поступками или отношениями", value: "overwhelmed", score: 3 },
    ],
  },
  {
    id: "complexity",
    eyebrow: "Связанность трудностей",
    title: "Насколько легко отделить одну трудность от другой?",
    options: [
      { label: "Есть одна ясная тема", value: "clear", score: 0 },
      { label: "Есть основная тема и несколько связанных с ней", value: "related", score: 1 },
      { label: "Трудностей несколько, и они тесно переплетены", value: "intertwined", score: 2 },
    ],
  },
  {
    id: "readiness",
    eyebrow: "Готовность к изменениям",
    title: "Как вы ощущаете свою готовность к работе сейчас?",
    note: "Этот ответ не увеличивает и не уменьшает число встреч. Он помогает точнее описать возможный темп работы.",
    options: [
      { label: "Я готов(а) пробовать новое и действовать между встречами", value: "ready" },
      { label: "Я хочу изменений, но сейчас у меня мало сил", value: "low-energy" },
      { label: "Я пока не уверен(а), что готов(а) что-то менять", value: "uncertain" },
      { label: "Мне прежде всего нужно облегчение и поддержка", value: "support-first" },
    ],
  },
];

const bands = [
  {
    title: "Консультация или короткий цикл",
    min: 1,
    max: 3,
    checkpoint: 1,
    explanation: "Судя по ответам, задача выглядит достаточно локальной. Иногда одной встречи уже хватает, чтобы увидеть ситуацию яснее и наметить следующие шаги.",
  },
  {
    title: "Сфокусированная краткосрочная работа",
    min: 4,
    max: 8,
    checkpoint: 4,
    explanation: "Вероятно, будет полезен короткий цикл встреч вокруг одной основной задачи: разобраться в механизме трудности, попробовать новые способы действия и оценить изменения.",
  },
  {
    title: "Структурированная терапевтическая работа",
    min: 8,
    max: 16,
    checkpoint: 6,
    explanation: "Трудность затрагивает не только отдельную ситуацию. Понадобится время, чтобы понять её причины, освоить новые стратегии и закрепить изменения в повседневной жизни.",
  },
  {
    title: "Среднесрочная терапия",
    min: 16,
    max: 30,
    checkpoint: 8,
    explanation: "По ответам видно, что трудность существует давно или влияет на несколько сфер жизни. Работа, вероятно, будет включать и стабилизацию состояния, и изменение устойчивых сценариев.",
  },
  {
    title: "Долгосрочная терапия",
    min: 30,
    max: 50,
    checkpoint: 10,
    explanation: "Ваш запрос выглядит системным и многослойным. Это не означает, что облегчение появится только в конце: первые изменения могут начаться раньше, а общий маршрут лучше делить на обозримые этапы.",
  },
];

const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

function formatWeeks(minSessions: number, maxSessions: number, cadence: string) {
  const multiplier = cadence === "biweekly" ? 2 : 1;
  const minWeeks = minSessions * multiplier;
  const maxWeeks = maxSessions * multiplier;
  if (maxWeeks <= 7) return `${minWeeks}–${maxWeeks} нед.`;
  const toMonths = (weeks: number) => {
    const months = Math.round((weeks / 4.3) * 2) / 2;
    return Number.isInteger(months) ? String(months) : months.toFixed(1).replace(".", ",");
  };
  return `${toMonths(minWeeks)}–${toMonths(maxWeeks)} мес.`;
}

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <span aria-hidden="true" className={`arrow arrow-${direction}`}>
      →
    </span>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<"intro" | "questions" | "result">("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [price, setPrice] = useState(5000);
  const [cadence, setCadence] = useState<"weekly" | "biweekly" | "unsure">("weekly");
  const [copied, setCopied] = useState(false);

  const currentQuestion = questions[questionIndex];
  const totalSteps = questions.length;
  const currentStep = questionIndex + 1;
  const progress = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  const result = useMemo(() => {
    const scoredIds = ["goal", "duration", "breadth", "impact", "regulation", "complexity"];
    const score = scoredIds.reduce((sum, id) => sum + (answers[id]?.score ?? 0), 0);
    const scoreBand = score <= 3 ? 0 : score <= 6 ? 1 : score <= 10 ? 2 : score <= 14 ? 3 : 4;
    const goalFloor = answers.goal?.score ?? 0;
    const bandIndex = Math.max(scoreBand, goalFloor);
    return bands[bandIndex];
  }, [answers]);

  const reset = () => {
    setAnswers({});
    setQuestionIndex(0);
    setPrice(5000);
    setCadence("weekly");
    setCopied(false);
    setScreen("intro");
  };

  const openCalculator = () => {
    setScreen("intro");
    window.requestAnimationFrame(() => {
      document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const goBack = () => {
    if (screen === "questions" && questionIndex > 0) {
      setQuestionIndex((value) => value - 1);
      return;
    }
    if (screen === "questions") setScreen("intro");
    if (screen === "result") {
      setQuestionIndex(questions.length - 1);
      setScreen("questions");
    }
  };

  const chooseAnswer = (option: Option) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: option }));
  };

  const nextQuestion = () => {
    if (!answers[currentQuestion.id]) return;
    if (questionIndex === questions.length - 1) return;
    setQuestionIndex((value) => value + 1);
  };

  const finish = () => {
    if (!answers[currentQuestion.id]) return;
    setScreen("result");
    setCopied(false);
  };

  const durationText = cadence === "unsure"
    ? `${formatWeeks(result.min, result.max, "weekly")} при встречах раз в неделю или ${formatWeeks(result.min, result.max, "biweekly")} при встречах раз в две недели`
    : formatWeeks(result.min, result.max, cadence);

  const monthlyText = cadence === "biweekly"
    ? `${currency.format(price * 2)}–${currency.format(price * 3)}`
    : cadence === "unsure"
      ? `${currency.format(price * 2)}–${currency.format(price * 5)}`
      : `${currency.format(price * 4)}–${currency.format(price * 5)}`;

  const resultSummary = `Предварительный ориентир InTreatment\n${result.title}: ${result.min}–${result.max}${result === bands[4] ? "+" : ""} встреч.\nСрок: ${durationText}.\nПервая контрольная точка: после ${result.checkpoint}-й встречи.\nСтоимость первого этапа: ${currency.format(price * result.checkpoint)}.\nОбщий финансовый ориентир: ${currency.format(price * result.min)}–${currency.format(price * result.max)}${result === bands[4] ? " и более" : ""}.`;

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(resultSummary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="site-header">
        <button className="wordmark" type="button" onClick={() => { reset(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="На главную">
          InTreatment
        </button>
        <nav className="header-nav" aria-label="Навигация по странице">
          <a href="#how-it-works">Как это работает</a>
          <button type="button" onClick={openCalculator}>Рассчитать</button>
        </nav>
      </header>

      <div className="landing-content">
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="hero-copy">
            <p className="kicker">Бесплатный калькулятор InTreatment</p>
            <h1 id="landing-title">Сколько времени может занять терапия?</h1>
            <p className="hero-lead">
              Когда неизвестно, сколько встреч понадобится, трудно решиться даже на первую. Получите предварительный ориентир по длительности, этапам и бюджету — без регистрации и обещаний точной цифры.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={openCalculator}>
                Получить ориентир за 3 минуты <Arrow />
              </button>
              <span>7 вопросов · ответы не сохраняются</span>
            </div>
          </div>
          <div className="hero-route" aria-label="Что вы получите">
            <p className="section-label">На выходе</p>
            <div className="route-line">
              <span>01</span>
              <div><strong>Диапазон встреч</strong><p>Не одна пугающая цифра, а реалистичный коридор.</p></div>
            </div>
            <div className="route-line">
              <span>02</span>
              <div><strong>Первая контрольная точка</strong><p>Когда стоит остановиться и сверить изменения.</p></div>
            </div>
            <div className="route-line">
              <span>03</span>
              <div><strong>Срок и бюджет</strong><p>С учётом ритма и комфортной цены одной встречи.</p></div>
            </div>
          </div>
        </section>

        <section className="uncertainty-section" aria-labelledby="uncertainty-title">
          <div className="section-heading">
            <p className="section-label">Почему мы откладываем</p>
            <h2 id="uncertainty-title">Неизвестность тоже отнимает силы</h2>
            <p>Психотерапия часто выглядит как маршрут без карты: непонятно, сколько он займёт, во что обойдётся и когда станет ясно, что работа помогает.</p>
          </div>
          <div className="inner-voice-grid">
            <article>
              <span>Думает</span>
              <strong>«А вдруг это на годы?»</strong>
              <p>«Сколько денег закладывать?», «Можно ли решить это быстрее?», «Как понять, что есть результат?»</p>
            </article>
            <article>
              <span>Чувствует</span>
              <strong>Тревогу и потерю контроля</strong>
              <p>К сомнениям о самой терапии добавляются страх затрат, недоверие и неловкость от того, что нельзя заранее получить точный ответ.</p>
            </article>
            <article>
              <span>Делает</span>
              <strong>Откладывает или бросает раньше</strong>
              <p>Выбирает только по цене, ждёт мгновенного эффекта или остаётся в работе без понятных точек сверки.</p>
            </article>
          </div>
        </section>

        <section className="depth-section" id="how-it-works" aria-labelledby="depth-title">
          <div className="section-heading compact-heading">
            <p className="section-label">От чего зависит срок</p>
            <h2 id="depth-title">Одинаковая жалоба — не всегда одинаковая глубина работы</h2>
          </div>
          <div className="depth-layout">
            <div className="depth-scale" aria-label="Уровни возможной работы">
              <article className="depth-card depth-one">
                <span>01 · Ситуация</span>
                <h3>Увидеть варианты</h3>
                <p>Разобраться в одном разговоре, решении или недавно возникшей трудности.</p>
              </article>
              <article className="depth-card depth-two">
                <span>02 · Повторяющийся сценарий</span>
                <h3>Изменить привычный способ</h3>
                <p>Понять, почему ситуация возвращается, и попробовать новые способы думать, чувствовать и действовать.</p>
              </article>
              <article className="depth-card depth-three">
                <span>03 · Системные изменения</span>
                <h3>Вырастить новые опоры</h3>
                <p>Работать с тем, что существует давно, переплетает несколько сфер жизни и требует устойчивых изменений.</p>
              </article>
            </div>
            <div className="factor-list">
              <p className="section-label">Калькулятор учитывает</p>
              <ol>
                <li><span>01</span><p><strong>Желаемый результат</strong> — облегчение, решение конкретной задачи или глубокие изменения.</p></li>
                <li><span>02</span><p><strong>Давность и широту трудности</strong> — возникла недавно или давно влияет на разные сферы.</p></li>
                <li><span>03</span><p><strong>Влияние на повседневность</strong> — насколько трудно сохранять привычную жизнь и восстанавливаться.</p></li>
                <li><span>04</span><p><strong>Связанность тем</strong> — одна ли это ясная задача или несколько переплетённых трудностей.</p></li>
              </ol>
            </div>
          </div>
        </section>

        <section className="value-section" aria-labelledby="value-title">
          <div className="value-quote">
            <p>Понимание срока не связывает вас обязательством. Оно помогает войти в терапию не вслепую.</p>
          </div>
          <div>
            <p className="section-label">Зачем нужен ориентир</p>
            <h2 id="value-title">Чтобы планировать и обсуждать терапию на равных</h2>
            <ul className="value-list">
              <li><span>✓</span>Сопоставить возможный маршрут со своим временем и бюджетом.</li>
              <li><span>✓</span>Сформулировать психологу, какого результата вы ждёте.</li>
              <li><span>✓</span>Заранее договориться о первой точке сверки динамики.</li>
              <li><span>✓</span>Помнить: облегчение может появиться раньше, чем завершится вся работа.</li>
            </ul>
          </div>
        </section>

        <section className="calculator-section" id="calculator" aria-labelledby="calculator-title">
          <div className="calculator-heading">
            <p className="section-label">Ваш предварительный маршрут</p>
            <h2 id="calculator-title">Получите персональный ориентир</h2>
            <p>Ответьте на семь вопросов. Калькулятор покажет возможное количество встреч, календарный срок, контрольную точку и бюджет.</p>
          </div>
          <div className="workspace">
            <aside className="context-panel">
              <div>
                <p className="kicker">Калькулятор терапии</p>
                <h2>От открытого вопроса — к понятному маршруту</h2>
                <p className="context-copy">
                  Не точный прогноз, а предварительный ориентир, который можно обсудить и уточнить с психологом.
                </p>
              </div>

              {screen === "questions" && (
                <div className="progress-block" aria-label={`Пройдено ${progress}%`}>
                  <div className="progress-meta">
                    <span>Шаг {currentStep} из {totalSteps}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
                  <p>Ответы не сохраняются и используются только для расчёта на этом устройстве.</p>
                </div>
              )}

              <div className="aside-note">
                <span className="note-mark">i</span>
                <p>Результат калькулятора не является диагнозом и может уточниться после первой встречи с психологом.</p>
              </div>
            </aside>

            <section className="calculator-card" aria-live="polite">
          {screen === "intro" && (
            <div className="intro-screen screen-enter">
              <p className="section-label">Предварительная оценка</p>
              <h2>Понятный ориентир без обещания точной цифры</h2>
              <p className="lead">
                Калькулятор учитывает давность и широту трудности, её влияние на жизнь и результат, к которому вы хотите прийти.
              </p>
              <div className="intro-facts">
                <div><strong>7</strong><span>содержательных вопросов</span></div>
                <div><strong>≈ 3 мин</strong><span>на прохождение</span></div>
                <div><strong>3 ориентира</strong><span>срок, этап и бюджет</span></div>
              </div>
              <button className="primary-button" type="button" onClick={() => { setScreen("questions"); setQuestionIndex(0); }}>
                Начать расчёт <Arrow />
              </button>
              <p className="privacy-note">Без регистрации. Мы не сохраняем ваши ответы.</p>
            </div>
          )}

          {screen === "questions" && (
            <div className="question-screen screen-enter" key={currentQuestion.id}>
              <button className="back-button" type="button" onClick={goBack}><Arrow direction="left" /> Назад</button>
              <p className="section-label">{currentQuestion.eyebrow}</p>
              <h2>{currentQuestion.title}</h2>
              {currentQuestion.note && <p className="question-note">{currentQuestion.note}</p>}
              <div className="option-list" role="radiogroup" aria-label={currentQuestion.title}>
                {currentQuestion.options.map((option) => {
                  const selected = answers[currentQuestion.id]?.value === option.value;
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`option-button ${selected ? "selected" : ""}`}
                      key={option.value}
                      onClick={() => chooseAnswer(option)}
                    >
                      <span className="option-radio" />
                      <span>
                        <strong>{option.label}</strong>
                        {option.description && <small>{option.description}</small>}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="question-footer">
                <span>{questionIndex + 1} / {questions.length}</span>
                {questionIndex === questions.length - 1 ? (
                  <button className="primary-button compact" type="button" disabled={!answers[currentQuestion.id]} onClick={finish}>
                    Перейти к бюджету <Arrow />
                  </button>
                ) : (
                  <button className="primary-button compact" type="button" disabled={!answers[currentQuestion.id]} onClick={nextQuestion}>
                    Продолжить <Arrow />
                  </button>
                )}
              </div>
            </div>
          )}

          {screen === "result" && (
            <div className="result-screen screen-enter">
              <div className="result-topline">
                <button className="back-button" type="button" onClick={goBack}><Arrow direction="left" /> Изменить ответы</button>
                <span className="result-pill">Предварительный результат</span>
              </div>

              <div className="budget-config">
                <div className="config-heading">
                  <div>
                    <p className="section-label">Ваш бюджет</p>
                    <h2>Настройте финансовый ориентир</h2>
                  </div>
                  <output>{currency.format(price)}</output>
                </div>
                <label htmlFor="session-price">Комфортная стоимость одной встречи</label>
                <input
                  id="session-price"
                  type="range"
                  min="3000"
                  max="15000"
                  step="500"
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                />
                <div className="range-labels"><span>3 000 ₽</span><span>15 000 ₽</span></div>
                <div className="price-chips">
                  {[4000, 5000, 6000, 7000, 15000].map((value) => (
                    <button type="button" className={price === value ? "active" : ""} key={value} onClick={() => setPrice(value)}>{currency.format(value)}</button>
                  ))}
                </div>
                <fieldset className="cadence-fieldset">
                  <legend>Предполагаемый ритм встреч</legend>
                  <div>
                    {[
                      ["weekly", "Раз в неделю"],
                      ["biweekly", "Раз в две недели"],
                      ["unsure", "Пока не знаю"],
                    ].map(([value, label]) => (
                      <button
                        type="button"
                        className={cadence === value ? "active" : ""}
                        key={value}
                        onClick={() => setCadence(value as typeof cadence)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="result-hero">
                <p className="section-label">Ваш предварительный маршрут</p>
                <h2>{result.title}</h2>
                <div className="session-range"><strong>{result.min}–{result.max}{result === bands[4] ? "+" : ""}</strong><span>встреч</span></div>
                <p>{result.explanation}</p>
              </div>

              <div className="result-metrics">
                <article className="mint-card">
                  <span>Календарный срок</span>
                  <strong>{durationText}</strong>
                  <p>Срок меняется в зависимости от регулярности встреч.</p>
                </article>
                <article className="beige-card">
                  <span>Первая сверка результата</span>
                  <strong>После {result.checkpoint}-й встречи</strong>
                  <p>Стоимость первого этапа — {currency.format(price * result.checkpoint)}.</p>
                </article>
                <article className="lavender-card">
                  <span>Финансовый ориентир</span>
                  <strong>{currency.format(price * result.min)}–{currency.format(price * result.max)}{result === bands[4] ? "+" : ""}</strong>
                  <p>Около {monthlyText} в месяц при выбранном ритме.</p>
                </article>
              </div>

              {answers.readiness?.value !== "ready" && (
                <div className="pace-note">
                  <span className="note-mark">i</span>
                  <p>
                    {answers.readiness?.value === "low-energy" || answers.readiness?.value === "support-first"
                      ? "Если сейчас мало сил, первый этап может быть посвящён не активным изменениям, а облегчению состояния и восстановлению опор. Это нормальная часть терапии."
                      : "Необязательно быть полностью готовым к переменам до начала терапии. Готовность и ясность задачи могут появляться постепенно, в контакте с психологом."}
                  </p>
                </div>
              )}

              <details className="method-details">
                <summary>Как получился этот результат?</summary>
                <p>Калькулятор учитывает желаемую глубину изменений, давность и широту трудности, её влияние на повседневную жизнь, скорость восстановления и связанность нескольких проблем. Готовность к изменениям не начисляет баллы.</p>
              </details>

              <div className="result-actions">
                <a className="messenger-cta telegram-cta" href="https://t.me/Intreatmentpsy_bot" target="_blank" rel="noreferrer">
                  <svg className="messenger-icon telegram-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21.6 3.4 18.4 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6 12.8l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20 2.7c.9-.3 1.7.2 1.6.7Z" />
                  </svg>
                  <span>Перейти в Telegram</span>
                </a>
                <a className="messenger-cta vk-cta" href="https://vk.me/in_treatment_psy" target="_blank" rel="noreferrer">
                  <svg className="messenger-icon vk-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.8 16.2s.3 0 .4-.2c.1-.1.1-.4.1-.4s0-1.3.6-1.5c.6-.2 1.3 1.2 2.1 1.8.6.4 1.1.3 1.1.3h2.1s1.1-.1.6-.9c0-.1-.3-.7-1.6-1.8-1.3-1.2-1.2-1 .5-3.2 1-1.3 1.4-2.1 1.3-2.5-.1-.3-.8-.2-.8-.2h-2.4s-.2 0-.3.1c-.1.1-.2.3-.2.3s-.4 1-.9 1.9c-1.1 1.8-1.5 1.9-1.7 1.8-.4-.3-.3-1.1-.3-1.6 0-1.8.3-2.5-.5-2.7-.3-.1-.5-.1-1.1-.1-.9 0-1.6 0-2 .2-.3.1-.5.4-.4.5.2 0 .5.1.7.4.2.3.2 1.1.2 1.1s.1 2.1-.3 2.3c-.3.2-.8-.2-1.7-1.8-.5-.8-.9-1.8-.9-1.8s-.1-.2-.2-.3c-.2-.1-.4-.1-.4-.1H4.7s-.3 0-.5.2c-.1.1 0 .4 0 .4s1.8 4.2 3.8 6.3c1.9 1.9 4 1.8 4 1.8h.8Z" />
                  </svg>
                  <span>Перейти в VK</span>
                </a>
                <button className="secondary-button" type="button" onClick={copyResult}>{copied ? "Результат скопирован" : "Скопировать результат"}</button>
                <button className="text-button" type="button" onClick={reset}>Пройти заново</button>
              </div>

              <p className="result-disclaimer">Это ориентир, а не назначение курса терапии. Количество встреч может измениться после знакомства с психологом и по мере появления реальных результатов.</p>
            </div>
          )}
            </section>
          </div>
        </section>

        <section className="ethics-section" aria-labelledby="ethics-title">
          <div>
            <p className="section-label">Важно</p>
            <h2 id="ethics-title">Ориентир, а не назначение курса</h2>
          </div>
          <div className="ethics-copy">
            <p>Психотерапия нелинейна. Один человек приходит с локальной ситуацией, другой — с похожей жалобой, за которой стоит давний повторяющийся сценарий. Поэтому честная оценка всегда выглядит как диапазон.</p>
            <p>Количество встреч может измениться после знакомства с психологом и по мере появления реальной динамики. Важно не ждать финала молча, а регулярно обсуждать, что уже изменилось, где вы сейчас и куда движется работа.</p>
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="section-heading compact-heading">
            <p className="section-label">Коротко о главном</p>
            <h2 id="faq-title">Частые вопросы</h2>
          </div>
          <div className="faq-list">
            <details><summary>Может ли помочь одна консультация?</summary><p>Да, если задача локальная: принять решение, подготовиться к разговору или увидеть новые варианты. Но иногда впервые возникший симптом оказывается верхушкой более давнего напряжения.</p></details>
            <details><summary>Почему калькулятор показывает диапазон?</summary><p>На длительность влияют не только сама жалоба, но и её давность, влияние на разные сферы жизни, желаемая глубина изменений, темп работы и контакт с психологом.</p></details>
            <details><summary>Если получился длинный маршрут, облегчение будет нескоро?</summary><p>Не обязательно. Изменения состояния, оценки ситуации или поведения могут начаться уже после первых встреч. Длиннее может быть путь к устойчивому закреплению этих изменений.</p></details>
            <details><summary>Как использовать результат?</summary><p>Сохраните его и обсудите на первой встрече: совпадает ли оценка психолога, какая цель будет у первого этапа и после какой встречи вы вместе проверите динамику.</p></details>
          </div>
        </section>

        <section className="final-cta">
          <p className="section-label">Первый шаг</p>
          <h2>Не нужно заранее знать весь путь. Достаточно увидеть его первый отрезок.</h2>
          <button className="primary-button" type="button" onClick={openCalculator}>
            Рассчитать длительность терапии <Arrow />
          </button>
        </section>
      </div>

      <footer>
        <span>InTreatment</span>
        <p>Соединяем с психологом, который подходит именно вам · <a href="https://intreatment.online/" target="_blank" rel="noreferrer">intreatment.online</a></p>
      </footer>
    </main>
  );
}
