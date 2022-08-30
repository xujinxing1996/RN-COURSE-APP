import React, { Component } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PropTypes from "prop-types";

const { width } = Dimensions.get("window");

class Loading extends Component {
  renderAnimation = () => {
    const defaultAnimation = <ActivityIndicator size={60} color="#1156D4" />;
    return this.props.indicator || defaultAnimation;
  };

  renderContent = () => {
    const defaultContent = (
      <Text style={[styles.loadingText, this.props.textStyle]}>
        {this.props.loadingText || "加载中"}
      </Text>
    );
    return this.props.content || defaultContent;
  };

  getContainerStyles = () => {
    let style = [styles.container];
    if (this.props.overlay) {
      style.push(styles.overlayContainer);
    }
    style.push(this.props.style);
    return style;
  };

  renderLoadingView = () => {
    return (
      <View style={this.getContainerStyles()}>
        {this.renderAnimation()}
        {this.renderContent()}
      </View>
    );
  };

  render() {
    if (this.props.loading) {
      return this.renderLoadingView();
    } else {
      return this.props.children;
    }
  }
}

Loading.propTypes = {
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
};
export default Loading;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContainer: {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  animationStyle: {
    width: width / 2,
    height: width / 2,
  },
  loadingText: {
    marginTop: 16,
    fontWeight: "600",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});
