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
        //   <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
        // <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>

  return (
    <div data-qa="hit">
		<a target='_new' href={source.href} dangerouslySetInnerHTML={{__html:source.gene_symbol}} />
		<dl>
			<dt>Organism</dt>
			<dd dangerouslySetInnerHTML={{__html:source.organism}}></dd>
		</dl>
		<dl>
			<dt>Gene Name</dt>
			<dd dangerouslySetInnerHTML={{__html:source.gene_name}}></dd>
		</dl>
		<dl>
			<dt>Description</dt>
			<dd dangerouslySetInnerHTML={{__html:source.description}}></dd>
		</dl>
    </div>
  );
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
						placeholder="Search genes..."
						prefixQueryFields={["gene_name", "description", "secondary_id", "organism", "gene_symbol^10"]}
					/>
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
			            </ActionBarRow>
			            <ActionBarRow>
			              <SelectedFilters/>
			              <ResetFilters/>
			            </ActionBarRow>
			          </ActionBar>
			          <Hits mod="sk-hits-list" hitsPerPage={10} itemComponent={GeneItem} highlightFields={["gene_name", "description", "secondary_id", "organism", "gene_symbol"]}
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
