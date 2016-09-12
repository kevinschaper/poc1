import * as React from 'react';

import {
    SearchkitManager, SearchkitProvider,
    SearchBox
} from "searchkit";

require("./index.scss");

export class App extends React.Component {
    render () {
        // init search kit
        const host = "/api";
        const searchkit = new SearchkitManager(host);

        return (
            <SearchkitProvider searchkit={searchkit}>
                <div>
                    <div className="logo-container">
                        <div className="row">
                            <div className="col-sm-6">
                              <img src="https://s3-us-west-2.amazonaws.com/human-portal-mockup/img/logo.png" className="agr-logo" />
                            </div>
                        </div>
                    </div>
                    <nav className="navbar navbar-inverse">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                            </div>
                            <div id="navbar" className="navbar-collapse collapse">

                                <ul className="nav navbar-nav navbar-right">
                                    <li><a href="#"><span className="glyphicon glyphicon-info-sign"></span> About</a></li>
                                    <li><a href="#"><span className="glyphicon glyphicon-question-sign"></span> Help</a></li>
                                    <li>
                                        <div className='search-container'>
                                            <SearchBox
                                                autofocus={true}
                                                searchOnChange={true}
                                                placeholder="Search genes..."
                                                prefixQueryFields={["gene_name", "description", "secondary_id", "organism", "gene_symbol^10"]}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <div className="container-fluid">
                        <div className="row application-row">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </SearchkitProvider>
        );
    }
};
