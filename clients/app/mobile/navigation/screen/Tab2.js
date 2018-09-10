import React from 'react';
import {connect} from "react-redux"
import { 
    View, 
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Text from '../../components/AppText'
import Style from 'react-native-extended-stylesheet';
import {
    FetchImportableDocuments
} from "../../../common/actions"
import translate from '../../translate';

let mapStateToProps = function(state){
    return {
        importable : state.document.importable,
        document: state.document
    }
}

let mapDispatchToProps = function(dispatch){
    return {
        FetchImportableDocuments:(docIds)=>dispatch(FetchImportableDocuments(docIds))
    }
}

@connect(mapStateToProps,mapDispatchToProps)
export default class extends React.Component {
    constructor(){
        super();
    }

    componentDidMount(){
        this.props.FetchImportableDocuments()
    }

    openImport(docId, ipfs){
        window.navigation.push("ImportDocument",{
            id:docId,
            ipfs:ipfs,
        })
    }

    render_importable_slot(row,idx){
        return (<TouchableOpacity key={row.docId} onPress={this.openImport.bind(this,row.docId,row.ipfs)}>
            <View style={styles.importable_card}>
                <Text style={styles.card_title}>{row.name}</Text>
                <Text style={styles.card_author}>{translate("AUTHOR")} : {row.author}</Text>
            </View>
        </TouchableOpacity>)
    }
    
    render_importable(){
        let recv = this.props.document.recv || []
        let req = this.props.document.req || []
        let notImportDocuments = []
        for(var w of this.props.importable) {
            let alreadyImport = false
            for(var v of [...recv, ...req]) {
                if(v.id == w.docId) {
                    alreadyImport = true
                }
            }
            if(!alreadyImport)
                notImportDocuments.push(w)
        }

        if(notImportDocuments.length == 0){
            return (<View style={styles.no_import_document}>
                <Text> {translate("NO_IMPORTABLE_DOCUMENT")} </Text>
            </View>)
        }

        return (<ScrollView style={styles.importable_card_container}>
            {notImportDocuments.map((r,i)=>this.render_importable_slot(r,i))}
        </ScrollView>)
        
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>{translate("IMPORTABLE_DOCUMENT")}</Text>
                </View>
                <View style={styles.content}>
                    {this.props.importable ? this.render_importable() : <Text>Now Loading...</Text>}
                </View>
            </View>
        );
    }
}

const styles = Style.create({
    container : {
        flex:1,
        backgroundColor:"#FFFFFF",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:'$topPadding'
    },
    title:{
        flexDirection:"row",
        paddingBottom:20,
    },
    title_text:{
        fontSize:25,
        fontFamily:"$fontBold"
    },
    content:{
        flex:1,
        justifyContent:"center",
    },
    content_text:{
        fontFamily:"$font",
    },
    importable_card_container: {
        flex:1,
    },
    importable_card:{
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,

        marginBottom: 10,
        width:"100%",

        borderWidth: 1,
        borderRadius:10,
        borderColor:"#F1F0F0"
    },
    card_title:{
        fontSize: 20,
        marginBottom: 10,
    },
    card_author:{
        fontSize: 12
    },
    no_import_document: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center' 
    }
})