import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity,
    Image
} from 'react-native';

export default class extends React.Component {
    constructor(){
        super();
        this.state = {
            data : ""
        }
    }

    componentDidMount(){
        this.updateSign(this.props)
    }

    componentWillReceiveProps(props){
        if(props.sign != this.props.sign){
            this.updateSign(props)
        }
    }

    async updateSign(props){
        if(typeof props.sign == "function"){
            let data = await props.sign()
            this.setState({data})
        }else{
            this.setState({
                data: props.sign
            })
        }
    }

    render(){
        if(this.state.data){
            return (<Image resizeMode="stretch" source={{uri: `data:image/png;base64,${this.state.data}`}} style={this.props.style} />)
        }else{
            return <Text style={this.props.style}>Load Signature..</Text> 
        }
    }
}