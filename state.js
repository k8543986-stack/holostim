// state.js
const AppState = {
  NEW_USER: 'NEW_USER',
  REGISTERING: 'REGISTERING',
  READY: 'READY',
  IN_SESSION: 'IN_SESSION',
  SESSION_RESULT: 'SESSION_RESULT'
};

let appState = AppState.NEW_USER;

let player = {
  id: null,
  nickname: null,
  gender: null,
  level: 1,
  league: 'Новичок',
  xp: 0,
  consent: false
};
