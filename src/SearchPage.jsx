import * as React from "react";
import * as _ from "lodash";

import {
	SearchBox, RefinementListFilter, MenuFilter,
	Hits, HitsStats, NoHits, Pagination, SortingSelector,
	SelectedFilters, ResetFilters, ItemHistogramList,
	Layout, LayoutBody, LayoutResults, TopBar,
	SideBar, ActionBar, ActionBarRow
} from "searchkit";

const GeneItem = (props)=> {
	let data = props.result._source;
	const {bemBlocks, result} = props
	const source:any = _.extend({}, result._source, result.highlight)
	//   <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
	// <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>

	return (
	    <div data-qa="hit">
			<h4><a target='_new' href={source.href} dangerouslySetInnerHTML={{__html:source.gene_symbol}} /></h4>
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
			    <Layout>
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
				            operator="OR"
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
			</div>
		)
	}
}
