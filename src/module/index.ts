import axios from 'axios';
import { combineEpics, Epic } from "redux-observable";
import { filter, map, mergeMap } from 'rxjs/operators';
import { StateType } from 'typesafe-actions';
import { actionCreatorFactory } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

const factory = actionCreatorFactory();

/* Action creator */
enum ActionTypes {
  START_FETCH_ARTICLES = 'START_FETCH_ARTICLE',
  FETCHED_ARTICLES = 'FETCHED_ARTICLES',
  CHANGE_INPUT = 'CHANGE_INPUT',
}

export const startFetchArticles = factory<string>(ActionTypes.START_FETCH_ARTICLES);
export const fetchedArticles = factory<IArticle[]>(ActionTypes.FETCHED_ARTICLES);
export const changeInput = factory<string>(ActionTypes.CHANGE_INPUT);


/* Reducers */
export interface IArticle {
  title: string
  url: string
}

interface IState {
  readonly inputText: string
  readonly articles: IArticle[]
  readonly loading: boolean
}

const initialState: IState = {
  articles: [],
  inputText: '',
  loading: false
};

export const rootReducer = reducerWithInitialState<IState>(initialState)
  .case(startFetchArticles, (state, action) => {
    return {
      ...state,
      loading: true
    };
  })
  .case(fetchedArticles, (state, action) => {
    return {
      ...state,
      articles: [...action],
      loading: false
    }
  })
  .case(changeInput, (state, action) => {
    return {
      ...state,
      inputText: action
    };
  });

/* Epics */
const fetchArticleEpic: Epic = (action$, state$) => {
      // tslint:disable-next-line
  console.log(action$);
  return action$.pipe(
    filter(action => action.type === ActionTypes.START_FETCH_ARTICLES),
    mergeMap(action => {
      const userId = action.payload;
      // tslint:disable-next-line
      console.log('called!', userId);
      return axios.get(`https://qiita.com/api/v2/users/${userId}/items`)
        .then(res => res.data)
    }),
    map(articles => articles.map((a: IArticle) => a)),
    map(article => fetchedArticles(article))
  );
};

export const rootEpic = combineEpics(
  fetchArticleEpic
);

export type RootState = StateType<typeof rootReducer>