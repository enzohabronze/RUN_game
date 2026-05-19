export const gameText = {
  buttons: {
    start: "ИГРАТЬ",
    how: "УПРАВЛЕНИЕ",
    closeHow: "ПОНЯТНО",
    resume: "ПРОДОЛЖИТЬ",
    restartPause: "НАЧАТЬ ЗАНОВО",
    restart: "ЕЩЕ ПОПЫТКА",
    backToMenu: "ГЛАВНОЕ МЕНЮ",
    nextLevel: "СЛЕДУЮЩИЙ УРОВЕНЬ",
    finishGame: "ГЛАВНОЕ МЕНЮ",
    replayLevel: "ПЕРЕИГРАТЬ УРОВЕНЬ"
  },
  screens: {
    pauseKicker: "ПАУЗА",
    pauseTitle: "МАРШРУТ ПРИОСТАНОВЛЕН",
    howKicker: "УПРАВЛЕНИЕ",
    howTitle: "КЛАВИАТУРА И ТЕЛЕФОН",
    howSummary: "Свайп влево/вправо или стрелки меняют полосу. Пробел и кнопка сверху ставят игру на паузу.",
    levelCompleteKicker: "ИТОГИ УРОВНЯ",
    levelCompleteTitle: "МАРШРУТ ПРОЙДЕН",
    gameOverTitle: "ГРУЗ ПОТЕРЯН"
  },
  hud: {
    cargo: "ГРУЗ",
    collected: "СОБРАНО",
    route: "МАРШРУТ",
    level: "УРОВЕНЬ",
    soundOn: "ON",
    soundOff: "OFF"
  },
  results: {
    levelCompleteTitle: (levelName) => `${levelName} ПРОЙДЕН`,
    levelStats: ({ damageTaken, cargo, collected, itemGoal, score }) =>
      `УРОН ГРУЗУ: ${damageTaken}% · ГРУЗ: ${cargo}% · СОБРАНО: ${collected}/${itemGoal} · ОЧКИ: ${score}`,
    gameOverStats: ({ levelName, distance, distanceGoal, damageTaken, score }) =>
      `УРОВЕНЬ: ${levelName} · ДИСТАНЦИЯ: ${distance}/${distanceGoal} М · УРОН: ${damageTaken}% · ОЧКИ: ${score}`
  },
  stars: {
    fullAlt: "ЗВЕЗДА",
    emptyAlt: "ПУСТАЯ ЗВЕЗДА"
  }
};
