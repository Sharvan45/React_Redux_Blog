import React, { Component } from 'react';
//import * as ACTION_TYPES from '../store/actions/action_types';
import * as  ACTIONS from '../store/actions/actions';
//import Auth from '../Utils/auth';
import { connect } from 'react-redux';

class Container1 extends Component {
    Arrays1 = [
        { id: 1, name: "test1" },
        { id: 2, name: "test2" },
        { id: 3, name: "test3" },
    ]
    //constructor(props) {
    //super(props);
    ////this.state = {
    ////    stateprops1: "the initial one"
    //}

    RenderItems = (props) => (
        <div>
            {props.items.id}<br />
            {props.items.name}
        </div>
    )

    render() {
        const user_text = "text 1"
        return (
            <div>
                <button onClick={() => console.log(this.props.user_profile)}> Get State </button>
                <button onClick={() => this.props.action1()}> Dispatch Action 1 </button>
                <button onClick={() => this.props.action2()}> Dispatch Action 2</button>
                <button onClick={() => this.props.action_creator1()}> Dispatch Creator 1</button>
                <button onClick={() => this.props.action_creator2()}> Dispatch Action Creator 2</button>
                <button onClick={() => this.props.action_creator3(user_text)}> Dispatch Action Creator 3</button>
                {this.props.user_text ? <h1>{this.props.user_text}</h1> : "Set Value"}
            </div>);
    }
}

function mapStateToProps(state) {
    return {
        stateProp1: state.reducer1.stateProp1,
        user_text: state.user_reducer.user_text,
        user_profile:state.auth_reducer.profile
    }
}

function mapDispatchToProps(dispatch) {
    return {
        action1: () => dispatch(ACTIONS.SUCCESS),
        action2: () => dispatch(ACTIONS.FAILURE),
        action_creator1: () => dispatch(ACTIONS.success()),
        action_creator2: () => dispatch(ACTIONS.failure()),
        action_creator3: (text) => dispatch(ACTIONS.user_input(text))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container1);