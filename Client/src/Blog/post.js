import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

import * as ACTIONS from '../store/actions/actions';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import { setTimeout } from 'timers';

import Pagination from 'react-js-pagination';
import { TextField } from '@material-ui/core';


class Posts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            post_motion: [],
            opacity: 0,
            num_posts: 0,
            page_range: 0,
            activePage: 1,
            post_per_page: 5,
            posts_slice: [],
            post_search: [],
            post_search_motion: []
        }
    }

    componentDidMount() {
        this.handleTransition()
        axios.get('/api/get/allposts')
            .then(res => this.props.set_posts(res.data))
            .then(() => this.add_post_to_state(this.props.posts))
            .catch(err => console.log(err))
    }

    handleTransition = () => {
        setTimeout(() => this.setState({ opacity: 1 }), 400);
    }

    add_search_posts_to_state = (post) => {
        this.setState({ post_search: [] });
        this.setState({ post_search: [...post] });
        this.animate_search_posts();
    }

    animate_search_posts = () => {
        this.setState({ post_search_motion: [] });
        let i = 1;
        this.state.post_search.map(post => {
            setTimeout(() => this.setState({ post_search_motion: [...this.state.post_search_motion, post] }), 400 * i)
            i++;
        });
    }

    add_post_to_state = (post) => {
        this.setState({ posts: [...post] });
        this.setState({
            num_posts: this.state.posts.length,
            page_range: this.state.num_posts / 5
        });
        this.slice_posts();
        this.animate_posts();
    }

    slice_posts = () => {
        const indexOfLastPost = this.state.activePage * this.state.post_per_page;
        const indexOfFirstPage = indexOfLastPost - this.state.post_per_page;
        this.setState({ posts_slice: this.state.posts.slice(indexOfFirstPage, indexOfLastPost) });
        //console.log(this.state.posts_slice);
    }

    animate_posts = () => {
        this.setState({ post_motion: [] });
        let i = 1;
        this.state.posts_slice.map(post => {
            setTimeout(() => this.setState({ post_motion: [...this.state.post_motion, post] }), 400 * i)
            i++;
        });
    }

    handlePageChange = (pageNumber) => {
        this.setState({ activePage: pageNumber });
        setTimeout(() => this.slice_posts(), 50);
        setTimeout(() => this.animate_posts(), 100);
    }

    handleSearch = (event) =>{
        const search_query = event.target.value;
        axios.get('/api/get/searchposts',{params:{search_query:search_query}})
        .then(res=>this.props.posts_success(res.data))
        .then(()=>this.add_search_posts_to_state(this.props.search_posts))
        .catch(err=>console.log(err));
    }
    RenderPosts = (post) => (
        <div className="CardStyles">
            <Card>
                <CardHeader
                    title={<Link to={{ pathname: '/post/' + post.post.pid, state: { post } }}>
                        {post.post.title}
                    </Link>}
                    subheader={
                        <div className="FlexColumn">
                            <div className="FlexRow">
                                {moment(post.post.date_created).format('MMM Do,YYYY | h:mm a')}
                            </div>
                            <div className="FlexRow">
                                <i className="material-icons">thumb_up</i>
                                <div className="notification-num-posts">
                                    {post.post.like}
                                </div>
                            </div>
                        </div>
                    } />
                <br />
                <CardContent>
                    <span style={{ overflow: "hidden" }}>{post.post.body}</span>
                </CardContent>
            </Card>
        </div>
    );


    render() {
        return (
            <div>
                <div style={{ opacity: this.state.opacity, transition: 'opacity 2s ease' }}>
                    <br />
                    {this.props.is_authenticated
                        ?
                        <Link to="/addpost">
                            <Button variant="contained" color="primary">
                                Add Post
                    </Button>
                        </Link> :
                        <Link to="/signup">
                            <Button variant='contained' color='primary'>
                                Signup to Add Posts
                        </Button>
                        </Link>
                    }
                </div>
                <div>
                    <TextField
                        id="search"
                        label="Search"
                        margin='normal'
                        onChange={this.handleSearch}
                    />
                </div>
                <div>
                        {this.state.posts_search_motion ? this.state.post_motion.map(post =>
                            <this.RenderPosts key={post.pid} post={post} />)
                            : null}
                    </div>
                <div style={{ opacity: this.state.opacity, transition: 'opacity 2s ease' }}>
                    <h1>Posts</h1>
                    <div>
                        {this.state.post_motion ? this.state.post_motion.map(post =>
                            <this.RenderPosts key={post.pid} post={post} />)
                            : null}
                    </div>
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={5}
                        totalItemsCount={this.state.num_posts}
                        pageRangeDisplayed={this.state.page_range}
                        onChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        posts: state.posts_reducer.posts,
        is_authenticated: state.auth_reducer.is_authenticated,
        search_posts:state.posts_reducer.search_posts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_posts: (posts) => dispatch(ACTIONS.fetch_db_posts(posts)),
        posts_success:(posts) => dispatch(ACTIONS.fetch_search_posts(posts)),
        posts_failure:()=>dispatch(ACTIONS.remove_search_posts())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts)