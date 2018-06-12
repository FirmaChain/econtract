import React from 'react';
import { connect } from 'react-redux';
import AppRoutes from "./routes"

@connect(state => ({
  nav: state.nav,
}))
export default class AppWithNavigationState extends React.Component {
  render() {
    const { dispatch, nav, addListener } = this.props;
    return (
      <AppRoutes
        navigation={{
          dispatch,
          state: nav,
          addListener,
        }}
      />
    );
  }
}
