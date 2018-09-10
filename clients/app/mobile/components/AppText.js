'use strict';

import React, {Component} from 'react';
import {
  Text,
} from 'react-native';
import Style from 'react-native-extended-stylesheet';

export default class AppText extends Component {
  constructor(props) {
    super(props)
    this.style = Style.create({
      reformFont : {
        fontFamily: '$font'
      }
    })._reformFont
  }

  render() {
    return (<Text {...this.props} style={[this.style, this.props.style]}>
      {this.props.children}
    </Text>)
  }
}