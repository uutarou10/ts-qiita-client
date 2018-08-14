import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '../node_modules/redux';
import { changeInput, IArticle, RootState, startFetchArticles } from './module';

interface IProps {
  articles: IArticle[],
  inputText: string,
  loading: boolean,
  changeInput: (text: string) => any
  startFetchArticles: (text: string) => any
}

class App extends React.Component<IProps> {
  public render() {
    const onInputHandler = (event: React.FormEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement
      this.props.changeInput(target.value);
    };

    const onButtonClickHandler = () => {
      this.props.startFetchArticles(this.props.inputText);
    }
    
    const infoText = () => {
      if (this.props.loading) {
        return 'Loading...';
      } else {
        if (this.props.articles.length === 0) {
          return '';
        } else {
          return `${this.props.articles.length}件です!!`
        }
      }
    };

    return (
      <div>
        <input
          type='text'
          placeholder='user id'
          value={this.props.inputText}
          onInput={onInputHandler}
          disabled={this.props.loading}
        />
        <button
          onClick={onButtonClickHandler}
          disabled={this.props.loading}
        >表示</button>
        <hr/>
        <p>{infoText()}</p>
        <ul>
          {this.props.articles.map(article => (
            <li key={article.url}><a href={article.url}>{article.title}</a></li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  articles: state.articles,
  inputText: state.inputText,
  loading: state.loading
});

const mapDiapatchToProps = (dispatch: Dispatch) => ({
  changeInput: (text: string) => dispatch(changeInput(text)),
  startFetchArticles: (userId: string) => dispatch(startFetchArticles(userId))
});

export default connect(mapStateToProps, mapDiapatchToProps)(App);

