import React, { Component } from 'react';
import axios from 'axios';
import history from '../Utils/history';

import * as ACTIONS from '../store/actions/actions';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { setTimeout } from 'timers';
import {Link} from 'react-router-dom'




class ShowPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            comment: '',
            cid: '',
            opacity: 0,
            comment_arr: [],
            comments_motion: [],
            delete_comment_id: 0,
            likes: this.props.location.state.post.likes,
            like_user_ids: this.props.location.state.post.like_user_id,
            like_post:true
        }
    }

    handleTransition = () => {
        setTimeout(() => this.setState({ opacity: 1 }), 400);
    }

    add_comments_to_state = (comments) => {
        this.setState({ comment_arr: [...comments] });
        this.animate_comments();
    }

    animate_comments = () => {
        this.setState({ comments_motion: [] });
        let i = 1;
        this.state.comment_arr.map(post => {
            setTimeout(() => this.setState({ comments_motion: [...this.state.comments_motion, post] }), 400 * i)
            i++;
        });
    }

    handleCommentUpdate = (comment) => {
        const commentIndex = this.state.comments_motion.findIndex(com => com.cid === comment.cid);
        let newArray = [...this.state.comments_motion];
        newArray[commentIndex] = comment;
        this.setState({ comments_motion: newArray });
    }

    handleCommentSubmit = (submitted_commment) => {
        setTimeout(() => this.setState({ comments_motion: [submitted_commment, ...this.state.comments_motion] }), 50);
    }

    handleCommentDelete = (cid) => {
        this.setState({ delete_comment_id: cid });
        const newCommentArray = this.state.comments_motion.filter(com => com.cid !== cid);
        setTimeout(() => this.setState({ comments_motion: newCommentArray }), 2000);
        setTimeout(() => this.handleClose(), 2010);
    }
    RenderComments = (props) => (
        <div className={this.state.delete_comment_id === props.comment.cid
            ? "FadeOutComment"
            : "CommentStyles"}>
            <h3>{props.comment.comment}</h3>
            <small>{props.comment.date_created ==="Just Now"
                ? <div>{props.comment.isEdited
                    ? <span>Edited</span> : <span>Just Now</span>}
                    }</div>
                : props.comment.date_created
            }
            </small>
            <p>By : {props.comment.author}</p>
            {props.cur_user_id === props.comment.user_id ?
                <Button onClick={() => this.handleClickOpen(props.comment.cid, props.comment.comment)} > Edit</Button>
                : null
            }
        </div>
    )


    componentDidMount() {
        axios.get('/api/get/allpostcomments', {
            params: { post_id: this.props.location.state.post.post.pid }
        })
            .then(res => this.props.set_comments(res.data))
            .then(() => this.add_comments_to_state(this.props.comments))
            .catch(err => console.log(err))
        this.handleTransition();
    }
    handleClickOpen = (cid, comment) => {
        this.setState({ open: true, cid: cid, comment: comment });
    }

    handleClose = () => {
        this.setState({ open: false, cid: '', comment: '' });
    }

    handleCommentChange = (event) => {
        this.setState({ comment: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ comment: '' });
        const comment = event.target.comment.value;
        const user_id = this.props.db_profile[0].uid;
        const post_id = this.props.location.state.post.post.pid;
        const username = this.props.db_profile[0].username;
        const temp_cid = Math.random;
        const just_now = "Just Now";
        const data = {
            comment: comment,
            post_id: post_id,
            user_id: user_id,
            username: username
        }
        const submitted_comment = {
            cid: temp_cid,
            comment: comment,
            user_id: user_id,
            author: username,
            date_created: just_now
        }
        // console.log(data);
        axios.post('/api/post/commenttodb', data)
            .then(res => console.log(res))
            .catch(err => console.log(err))
        window.scroll({ top: 0, left: 0, behaviour: 'smooth' });
        this.handleCommentSubmit(submitted_comment);

    }

    handleUpdate = () => {
        const comment = this.state.comment;
        const cid = this.state.cid;
        const user_id = this.props.db_profile[0].uid;
        const post_id = this.props.location.state.post.post.pid;
        const username = this.props.db_profile[0].username;
        const just_now = "Just Now"
        const data = {
            cid: cid,
            comment: comment,
            post_id: post_id,
            user_id: user_id,
            username: username
        }
        const editted_comment = {
            cid: cid,
            comment: comment,
            post_id: post_id,
            user_id: user_id,
            author: username,
            isEditted: true,
            date_created: just_now
        }
        console.log(data);
        axios.put('/api/put/commenttodb', data)
            .then(res => console.log(res))
            .catch(err => console.log(err))
        this.handleCommentUpdate(editted_comment);
    }

    handleDelete = () => {
        const cid = this.state.cid;
        console.log(cid);
        axios.delete('/api/delete/comment', { data: { cid: cid } })
            .then(res => console.log(res))
            .catch(err => console.log(err))
        this.handleCommentDelete(cid);
    }

    handleLikes = () =>{
        const user_id = this.props.db_profile[0].uid;
        const post_id = this.props.location.state.post.post.pid;
        const data = {uid:user_id,post_id:post_id};
        axios.put('/api/put/likes',data)
        .then(!this.state.like_user_ids.includes(user_id)&& this.state.like_post?
        this.setState({likes:this.state.likes+1}):null)
        .then(()=>this.setState({like_post:false}))
        .catch((err)=>console.log(err))
    }
    render() {
        return (
            <div>
                <div>
                    <h2>Post</h2>
                    <h4>{this.props.location.state.post.post.title}</h4>
                    <p>{this.props.location.state.post.post.body}</p>
                    <p>{this.props.location.state.post.post.author}</p>
                    <a style={{cursor:'pointer'}} onClick={this.props.isAuthenticated
                    ?()=> this.handleLikes() :()=> history.replace('/signup')}>
                        <i className='material-icons'>thumb_up</i>
                        <small className="notification-num-showpost">{this.state.likes}</small>
                    </a>
                </div>
                <div style={{ opacity: this.state.opacity, transition: 'opacity 2s ease' }}>
                    <h2>Comments:</h2>
                    {this.state.comments_motion ?
                        this.state.comments_motion.map((comment) =>
                            <this.RenderComments comment={comment} cur_user_id={this.props.db_profile[0].uid} key={comment.cid} />)
                        : null}
                </div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            id="comment"
                            label="Comment"
                            margin="normal" />
                        <br />
                        {this.props.is_authenticated 
                        ?<Button type="submit">Submit</Button>
                    :<Link to="/signup">
                    <Button variant='contained' color='primary'>
                        Signup to Comment
                    </Button>
                </Link>
                    }
                    </form>
                </div>
                <div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description" >
                        <DialogTitle id="alert-dialog-title">Edit Comment </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <input type="text" value={this.state.comment} onChange={this.handleCommentChange} />
                            </DialogContentText>
                            <DialogActions>
                                <Button onClick={() => { this.handleUpdate(); this.setState({ open: false }) }}>
                                    Agree</Button>
                                <Button onClick={() => this.handleClose()}>Cancel</Button>
                                <Button onClick={() => this.handleDelete()}>Delete</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        comments: state.posts_reducer.comments,
        db_profile: state.auth_reducer.db_profile,
        isAuthenticated:state.auth_reducer.is_authenticated
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_comments: (comments) => dispatch(ACTIONS.fetch_post_comments(comments))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowPost);