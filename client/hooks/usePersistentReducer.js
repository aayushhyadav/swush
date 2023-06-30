import { useReducer } from 'react';
import { initialAppState } from 'store/initialAppState';

function init(initialValues) {
  const initialState = initialValues;

  try {
    for (const key in initialValues) {
      if (!(initialValues[key] instanceof number)) return;

      const index = sessionStorage.getItem(key) ?? initialValues[key];
      // const index = sessionStorage.getItem(key) ?? 0;
      initialState[key] = parseInt(index);
    }
  } catch (error) {
    // console.log(error);
  }

  try {
    const storedJwt = sessionStorage.getItem('jwt');
    initialState['jwt'] = storedJwt ?? null;
    initialState['isLoggedIn'] = storedJwt ? true : false;
    initialState['username'] = sessionStorage.getItem('username') ?? '';
  } catch (error) {
    initialState['jwt'] = null;
    initialState['isLoggedIn'] = false;
    initialState['username'] = '';
  }

  return initialState;
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        jwt: sessionStorage.getItem('jwt'),
        notifications: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        jwt: null,
      };

    case 'GOT_TEAM':
      return {
        ...state,
        teams: action.payload,
      };

    case 'UPDATE_NUM_TEAMS':
      return {
        ...state,
        numTeams: action.payload.length,
      };

    case 'GOT_MEMBER':
      return {
        ...state,
        members: action.payload,
      };

    case 'GOT_SECRET_DES':
      return {
        ...state,
        secretDes: action.payload,
      };

    case 'GOT_SECRET':
      return {
        ...state,
        secret: action.payload,
      };

    case 'SELECT_TEAM':
      return {
        ...state,
        teamIndex: action.payload,
      };

    case 'SELECT_SECRET':
      return {
        ...state,
        secretIndex: action.payload,
      };

    case 'SELECT_MEMBER':
      return {
        ...state,
        memberIndex: action.payload,
      };

    case 'ALL_DESCRIPTIONS':
      return {
        ...state,
        allDescriptions: action.payload,
      };

    case 'ALL_SECRETS':
      return {
        ...state,
        allSecrets: action.payload,
      };

    case 'SELECTED_SECRET':
      return {
        ...state,
        selectedSecret: action.payload,
      };

    case 'SELECTED_DES':
      return {
        ...state,
        selectedDes: action.payload,
      };

    case 'SELECTED_SEC_ID':
      return {
        ...state,
        selectedSecretId: action.payload,
      };

    case 'TOGGLE_DIALOG':
      return {
        ...state,
        nameOpenDialog: action.payload,
      };

    case 'SET_NAME':
      return {
        ...state,
        username: action.payload,
      };

    case 'SET_FILENAME':
      return {
        ...state,
        selectedFileName: action.payload,
      };

    case 'RESET_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};

export function usePersistentReducer() {
  const [state, dispatch] = useReducer(reducer, initialAppState, init);

  return [state, dispatch];
}
