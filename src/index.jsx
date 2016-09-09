import * as React from "react";
import * as ReactDOM from "react-dom";
import {SearchPage} from "./SearchPage";
import {App} from "./AppPage";
import { Router, Link, Route, hashHistory, IndexRoute } from 'react-router'

const Home = () => {
  return (
    <div>
      <Link to="search">Go to Search</Link>
    </div>
  )
}

ReactDOM.render((
<Router history={hashHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={SearchPage}/>
    <Route path="search" component={SearchPage}/>
  </Route>
</Router>
), document.getElementById('root'));
