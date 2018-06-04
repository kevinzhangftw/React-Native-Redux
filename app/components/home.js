'use strict';

import React, {Component} from 'react';
var {
    StyleSheet,
    ListView,
    View,
    Text,
    ActivityIndicator, TouchableHighlight, ActionSheetIOS, TouchableWithoutFeedback
} = require('react-native');

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ReduxActions from '../actions'; //Import your actions

import {Actions} from 'react-native-router-flux';


//Buttons for Action Sheet
var BUTTONS = [
    "Edit",
    "Delete",
    'Cancel',
];

var CANCEL_INDEX = 2;

var _this;


const styles = StyleSheet.create({

  container:{
      flex:1,
      backgroundColor: '#F5F5F5'
  },

  activityIndicatorContainer:{
      backgroundColor: "#fff",
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
  },

  row:{
      borderBottomWidth: 1,
      borderColor: "#ccc",
      padding: 10
  },

  author: {
      fontSize: 14,
      fontWeight: "600",
      marginTop: 8 * 2
  },

  quote: {
      marginTop: 5,
      fontSize: 14,
  },

  addButton: {
      backgroundColor: '#ff5722',
      borderColor: '#ff5722',
      borderWidth: 1,
      height: 50,
      width: 50,
      borderRadius: 50 / 2,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 20,
      right: 20,
      shadowColor: "#000000",
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowOffset: {
          height: 1,
          width: 0
      }
  }
})

class Home extends Component {
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds: ds
        };
    }

    componentDidMount() {
        this.props.getQuotes();
        _this = this;
    }

    render() {
        if (this.props.loading) {
            return (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator
                        animating={true}
                        style={[{height: 80}]}
                        size="small"
                    />
                </View>
            );
        } else {
            return (
                <View style={{flex: 1, backgroundColor: '#eaeaea'}}>
                    <ListView enableEmptySections={true}
                              dataSource={this.state.ds.cloneWithRows(this.props.quotes)}
                              renderRow={this.renderRow.bind(this)}/>

                    <TouchableHighlight style={styles.addButton}
                                        underlayColor='#ff7043' onPress={() => Actions.new_quote()}>
                        <Text style={{fontSize: 25, color: 'white'}}>+</Text>
                    </TouchableHighlight>
                </View>
            );
        }
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableWithoutFeedback onPress={() => this.showOptions(rowData)}>
                <View style={styles.row}>
                    <Text style={styles.description}>
                        {rowData.quote}
                    </Text>
                    <Text style={styles.author}>
                        {rowData.author}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    showOptions(quote) {
        ActionSheetIOS.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) Actions.new_quote({quote: quote, edit: true, title:"Edit Quote"})
                else if (buttonIndex === 1) _this.props.deleteQuote(quote.id)
            });
    }
};

function mapStateToProps(state, props) {
    return {
        loading: state.dataReducer.loading,
        quotes: state.dataReducer.quotes
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ReduxActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
