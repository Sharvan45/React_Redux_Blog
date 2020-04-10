import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends Component {
    state = {
        num: [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ]
    }

    render() {
        return (
            <div>
                <Link to="/" style={{ padding: '5px' }}>
                    Home
                </Link>
                <Link to="/profile" style={{ padding: '5px' }}>
                    Profile
                </Link>
                <Link to="/posts" style={{ padding: '5px' }}>
                    Forum
                </Link>
                <Link to="/privateroute" style={{ padding: '5px' }}>
                    Private Route
                </Link>
                {
                    !this.props.is_authenticated ?
                        <button onClick={() => this.props.auth.login()} >Log In</button> :
                        <button onClick={() => this.props.auth.logout()}>Log Out</button>
                       
                }
                {this.state.num.map(nums =>
                    <Link key={nums.id} to={{ pathname: '/component/' + nums.id }} style={{ padding: '5px' }}>
                        Component {nums.id}
                    </Link>
                )}
            </div >
        );
    }
}
function mapStateToProps(state) {
    return {
        is_authenticated: state.auth_reducer.is_authenticated
    }
}

function mapDispatchToProps(dispatch) {
    return {
   
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Header);