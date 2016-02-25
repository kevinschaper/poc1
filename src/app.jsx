import * as React from "react";
import * as _ from "lodash";

import {
	SearchkitManager,
	SearchkitProvider,
	SearchBox,
	RefinementListFilter,
	Hits
} from "searchkit";

require("./index.scss");

const host = "http://demo.searchkit.co/api/movies"
const sk = new SearchkitManager(host, {
  multipleSearchers:false
})

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

export default class App extends React.Component {
	render() {
		return (
		<div className="sk-layout">
			<SearchkitProvider searchkit={sk}>
				<div>

					<div className="sk-layout__top-bar sk-top-bar">
				    <div className="sk-top-bar__content">
							<SearchBox autofocus={true} searchOnChange={true} queryFields={["actors^1","type^2","languages","title^5", "genres^2"]}/>
						</div>
					</div>

					<div className="sk-layout__body">

						<div className="sk-layout__filters">
							<RefinementListFilter id="actors" title="Genres" field="genres.raw" size={10}/>
						</div>

				    <div className="sk-layout__results sk-results-list">
							<Hits hitsPerPage={10} itemComponent={MovieHitsListItem} mod="sk-hits-list"/>
						</div>

					</div>

				</div>
			</SearchkitProvider>
		</div>

		);
	}
}
