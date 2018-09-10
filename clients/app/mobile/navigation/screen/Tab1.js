import React from 'react';
import {connect} from "react-redux"
import { 
	View, 
	TouchableOpacity,
	ScrollView,
	Linking, 
} from 'react-native'
import Text from '../../components/AppText'
import Icon from 'react-native-ionicons'
import EmptyDocumentItem from "../../components/EmptyDocumentItem"
import DocumentItem from "../../components/DocumentItem"
import Style from 'react-native-extended-stylesheet';
import {
	ReloadDocuments
} from "../../../common/actions"
import translate from '../../translate';

const DocSpacer = ()=><View style={styles.doc_spacer}/>
const Gap = ()=><View style={styles.gap10} />

let mapStateToProps = function(state){
	return {
		document: state.document
	}
}

let mapDispatchToProps = function(dispatch){
	return {
		ReloadDocuments : ()=>dispatch(ReloadDocuments())
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.Component {
	constructor(){
		super();
		this.state = {
			state_menu:1
		}
	}

	componentDidMount(){
        window.navigation = this.props.navigation

		this.props.ReloadDocuments()
	}

	onClickStateMenu = async(num)=>{
		if(this.onLoading)
			return ;
		
		this.onLoading = true;
		await window.showIndicator()

		this.setState({
			state_menu : num
		},async()=>{
			await window.hideIndicator()
			this.onLoading=false
		})
	}

	menu_item_render(idx, text, cnt){
		let sel = idx == this.state.state_menu
		return (<TouchableOpacity style={styles.flex1} onPress={this.onClickStateMenu.bind(this,idx)}>
			<View style={[styles.menu_item, sel ? styles.menu_item_selected : null]}>
				<View style={styles.spacer} />
				<Text style={[styles.menu_item_text, sel ? styles.menu_item_text_selected : null]}>
					{text}
				</Text>
				<View style={styles.spacer} />
				<View style={[styles.menu_item_cnt, sel ? styles.menu_item_cnt_selected : null]}>
					<Text style={[styles.menu_item_cnt_text, sel ? styles.menu_item_cnt_text_selected : null]}>
						{cnt}
					</Text>
				</View>
			</View>
		</TouchableOpacity>)
	}

	filterDocument(status){
		let recv = this.props.document.recv || []
		let req = this.props.document.req || []
		if(status == 1){
			// all
			return {
				recv:recv.filter(()=>true),
				req:req.filter(()=>true)
			}
		}else if(status == 2){
			// In Progress!
			let filter = (doc)=>{
				return doc.counterparties.find((c)=>!c.signed) != null
			}
			return {
				recv:recv.filter(filter),
				req:req.filter(filter)
			}
		}else if(status == 3){
			// Completed!
			let filter = (doc)=>{
				return doc.counterparties.find((c)=>!c.signed) == null
			}
			return {
				recv:recv.filter(filter),
				req:req.filter(filter)
			}
		}
	}

	CountingDocument(status){
		let filtered = this.filterDocument(status)
		return filtered.recv.length + filtered.req.length
	}

	menu_render(){
		return (<View>
			<View style={styles.menu}>
				{this.menu_item_render(1,translate("ALL"), this.CountingDocument(1) )}
				<Gap />
				{this.menu_item_render(2,translate("IN_PROGRESS"), this.CountingDocument(2) )}
				<Gap />
				{this.menu_item_render(3,translate("COMPLETED"), this.CountingDocument(3) )}
			</View>
		</View>)
	}
	
	onPressDocument = (type, key)=>{
		let filtered = this.filterDocument(this.state.state_menu)
		let doc = (type == 1 ? filtered.recv : filtered.req)[key]
		this.props.navigation.push("DocumentDetail",{
			docId:doc["id"]
		})
	}

	doc_list_render(type, docs){
		return docs.length == 0 ? <View style={styles.doc_list_container}>
			<EmptyDocumentItem />
			<DocSpacer />
		</View> : <View style={styles.doc_list_container}>
			{docs.map((item,key)=>{
				return <DocumentItem key={`${key}`} {...item} onPress={this.onPressDocument.bind(this, type, key)} />
			})}
		</View>
	}

	recv_doc_render(){
		let recv_docs = this.filterDocument(this.state.state_menu).recv || []
		return (<View style={styles.doc_list}>
			<View style={styles.doc_list_title}>
				<Text style={styles.doc_list_title_text}> {translate("RECEIVED_DOCUMENT")} </Text>
			</View>
			{this.doc_list_render(1, recv_docs)}
		</View>)
	}


	send_doc_render(){
		let send_docs = this.filterDocument(this.state.state_menu).req || []
		return (<View style={styles.doc_list}>
			<View style={styles.doc_list_title}>
				<Text style={styles.doc_list_title_text}> {translate("REQUESTED_DOCUMENT")} </Text>
			</View>
			{this.doc_list_render(2, send_docs)}
		</View>)
	}

	render() {
		let recv_doc
		let send_doc
		try {
 			recv_doc = this.recv_doc_render()
 			send_doc = this.send_doc_render()
		} catch(Err) {
			console.log(Err)
		}

		return (<View style={styles.container}>
			<View style={styles.top_container}>
				<View style={styles.title}>
					<Text style={styles.title_text}>{translate("MY_DOCUMENTS")}</Text>
					<View style={styles.spacer} />
					<TouchableOpacity onPress={()=>this.props.navigation.push('RegDoc')}>
						<Icon style={styles.plus_text} name="md-add-circle" />
					</TouchableOpacity>
				</View>

				{this.menu_render()}
			</View>

			<ScrollView style={styles.content}>
				{recv_doc}
				{send_doc}
				<Gap />
			</ScrollView>
		</View>)
	}
}

const styles = Style.create({
	container : {
		flex:1,
		backgroundColor:"#FFFFFF"
	},
	doc_list_title_text : {
		fontFamily: '$fontBold'
	},
	top_container : {
		paddingLeft:20,
		paddingRight:20,
		paddingTop:'$topPadding'
	},
	content : {
		paddingLeft:20,
		paddingRight:20,
	},
	title:{
		flexDirection:"row",
		paddingBottom:20,
	},
	title_text:{
		fontSize:25,
		fontFamily:"$fontBold"
	},
	plus_text:{
		fontSize:35,
		color:"#324b5f",
	},
	spacer:{
		flex:1
	},
	flex1:{
		flex:1
	},
	gap10:{
		width:10,
		height:10
	},
	menu:{
		flexDirection:"row",
		height:30,
	},
	menu_item:{
		flexDirection:"row",
		flex:1,
		borderRadius:15,
		justifyContent:"center",
		alignItems:"center",
		paddingLeft:5,
		paddingRight:5,
		backgroundColor:"#FFFFFF",
		borderColor:"#324b5f",
		borderWidth:1,
	},
	menu_item_text:{
		fontSize:12,
		fontFamily:"$fontBold",
		color:"#324b5f",
	},
	menu_item_cnt:{
		backgroundColor:"#324b5f",
		borderRadius:1000,
		width:15,
		height:15,
		justifyContent:"center",
		alignItems:"center",
	},
	menu_item_cnt_text:{
		fontSize:10,
		color:"#FFFFFF",
		fontFamily:"$font"
	},
	menu_item_selected:{
		backgroundColor:"#324b5f",
		borderColor:"#324b5f",
	},
	menu_item_text_selected:{
		color:"#FFFFFF",
	},
	menu_item_cnt_selected:{
		backgroundColor:"#FFFFFF",
	},
	menu_item_cnt_text_selected:{
		color:"#324b5f",
	},
	menu_indicator:{
		marginTop:10,
		backgroundColor:"#F5F3F3",
		flexDirection:"row",
		height:5,
		marginLeft:10,
		marginRight:10,
	},
	menu_indicator_item:{
		backgroundColor:"#9AC2CB",
		flex:1,
	},
	doc_list:{
		paddingTop:25,
		flexShrink:0,
		flexGrow:1,
	},
	doc_list_container:{
		flex:1,
		flexDirection:"row",
		paddingTop:10,
		flexWrap: "wrap",
		// justifyContent:"center",
		// alignItems:"center",
	},
	doc_spacer:{
		flex:1,
		marginRight:10,
		paddingLeft:6,
		paddingRight:6
	}
})