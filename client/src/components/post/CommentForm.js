import React, { Component } from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { addComment } from '../../actions/postActions';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'

class CommentForm extends Component {
   constructor(props){
       super(props);
       this.state = {
           text:'',
           errors: {}
       };
       this.onChange=this.onChange.bind(this);
       this.onSubmit= this.onSubmit.bind(this)
   }

   onSubmit(e){
     e.preventDefault();
  

     const { user } = this.props.auth;
     const {postID} = this.props
     const newComment ={
       text: this.state.text,
       name: user.name,
       avatar: user.avatar
     }
     this.props.addComment(postID, newComment);
     this.setState({text: ''})

   }

   componentWillReceiveProps(newProps){
     if(newProps.errors){
       this.setState({errors: newProps.errors})
     }
   }

   onChange(e){
     this.setState({[e.target.name]: e.target.value})
   }

  render() {
    const {errors} = this.state
    return (
        <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">
           Make a reply
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
              <TextAreaFieldGroup
                      placeholder="Reply to post"
                      name="text"
                      value={this.state.text}
                      onChange={this.onChange} 
                      error={errors.text}
                     />
              </div>
              <button type="submit" className="btn btn-dark">Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

CommentForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  postID: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  auth:PropTypes.object.isRequired
}

const mapStateToProp=(state) => ({
  errors:state.errors,
  auth: state.auth
})

export default connect(mapStateToProp, {addComment})(CommentForm)