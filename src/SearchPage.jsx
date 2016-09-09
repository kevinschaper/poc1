import * as React from "react";
import * as _ from "lodash";

import {
	SearchkitManager, SearchkitProvider,
	SearchBox, RefinementListFilter, MenuFilter,
	Hits, HitsStats, NoHits, Pagination, SortingSelector,
	SelectedFilters, ResetFilters, ItemHistogramList,
	Layout, LayoutBody, LayoutResults, TopBar,
	SideBar, ActionBar, ActionBarRow
} from "searchkit";

require("./index.scss");

const host = "/api"
const searchkit = new SearchkitManager(host)

const GeneItem = (props)=> {
	let data = props.result._source;
  const {bemBlocks, result} = props
  const source:any = _.extend({}, result._source, result.highlight)
  console.log(result.highlight)
        //   <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
        // <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>

  return (
    <div data-qa="hit">
		<a target='_new' href={source.href} dangerouslySetInnerHTML={{__html:source.gene_symbol}}/>
		<p dangerouslySetInnerHTML={{__html:source.gene_name}}/>
    </div>
  )
}




export class SearchPage extends React.Component {
	render(){
		return (
			<div>
				<h1>AGR :)</h1>
				<SearchkitProvider searchkit={searchkit}>
			    <Layout>
			      <TopBar>
			        <SearchBox
			          autofocus={true}
			          searchOnChange={true}
					placeholder="Search movies..."
			          prefixQueryFields={["gene_name", "description", "secondary_id", "gene_symbol^10"]}/>
			      </TopBar>
			      <LayoutBody>
			        <SideBar>
						<MenuFilter
							id="type"
							title="Gene Type"
							field="gene_type.raw"
							listComponent={ItemHistogramList}
						/>
						<RefinementListFilter
				            id="mol_func"
				            title="Organism"
				            field="organism.raw"
				            operator="AND"
				            size={10}
			            />

			        </SideBar>
			        <LayoutResults>
			          <ActionBar>
			            <ActionBarRow>
			              <HitsStats/>
										<SortingSelector options={[
											{label:"Relevance", field:"_score", order:"desc", defaultOption:true},
											{label:"Latest Releases", field:"released", order:"desc"},
											{label:"Earliest Releases", field:"released", order:"asc"}
										]}/>
			            </ActionBarRow>
			            <ActionBarRow>
			              <SelectedFilters/>
			              <ResetFilters/>
			            </ActionBarRow>
			          </ActionBar>
			          <Hits mod="sk-hits-list" hitsPerPage={10} itemComponent={GeneItem} highlightFields={["gene_name", "description", "secondary_id"]}
			            />
			          <NoHits/>
						<Pagination showNumbers={true}/>
			        </LayoutResults>
			      </LayoutBody>
			    </Layout>
			  </SearchkitProvider>
			</div>
		)
	}
}
