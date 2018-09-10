import React from 'react';
import {
    Alert,
    TouchableOpacity,
    Button,
    View
} from 'react-native';
import Text from '../../components/AppText'
import Orientation from 'react-native-orientation';
import SketchDraw from 'react-native-sketch-draw';
import Style from 'react-native-extended-stylesheet'
import translate from "../../../common/translate"

const SketchDrawConstants = SketchDraw.constants;
 
const tools = {};
 
tools[SketchDrawConstants.toolType.pen.id] = {
    id: SketchDrawConstants.toolType.pen.id,
    name: SketchDrawConstants.toolType.pen.name,
    nextId: SketchDrawConstants.toolType.eraser.id
};
tools[SketchDrawConstants.toolType.eraser.id] = {
    id: SketchDrawConstants.toolType.eraser.id,
    name: SketchDrawConstants.toolType.eraser.name,
    nextId: SketchDrawConstants.toolType.pen.id
};

export default class extends React.Component {
    constructor(){
        super();
        this.state = {
            color: '#FFFFFF',
            toolSelected: SketchDrawConstants.toolType.pen.id
        }
    }
    
    save = async(saveArgs) => {
        let callback = this.props.navigation.getParam("onCallback")
        if(callback && await callback(saveArgs.localFilePath)){
            this.props.navigation.goBack()
        }
    }

    componentDidMount(){
        Orientation.lockToLandscape();
    }

    componentWillUnmount(){
        Orientation.lockToPortrait();
    }
 
    render() {
        return (<View style={styles.container}>
            <SketchDraw 
                style={styles.sketch}
                ref="sketchRef"
                selectedTool={this.state.toolSelected} 
                toolColor={'#000000'}
                onSaveSketch={this.save} />

            <TouchableOpacity onPress={()=>this.refs.sketchRef.saveSketch()} style={[styles.bottom_button, styles.bottom_button_enable]}>
                <Text style={styles.bottom_button_text}>{translate("SIGN")}</Text>
            </TouchableOpacity>
        </View>);
    }
}

const styles = Style.create({
    container: {
        flex:1
    },
    sketch: {
        height:"100%"
    },
    bottom_button:{
        position:'absolute',
        bottom:0,
        left:0,
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:"#B6B6B7",
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        zIndex: 100
    },
    bottom_button_enable:{
        backgroundColor:"#324b5f",
    },
    bottom_button_text:{
        color:"#fff",
        fontSize:20,
        fontFamily:"$font",
    },
})

