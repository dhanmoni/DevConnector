import React, { Component } from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {getProfiles} from '../../actions/profileActions'
import Spinner from '../common/Spinner'
import ProfileItems from './ProfileItems';

class Profiles extends Component {

  componentDidMount(){
    this.props.getProfiles()
  }

  render() {
    const { profiles, loading} = this.props.profile;
    let profileItems;

    if(profiles === null || loading){
      profileItems = ( <Spinner/> )
    } else {
      if( profiles.length > 0){
        profileItems = profiles.map(profile=> (
          <ProfileItems key={profile._id} profile={profile}/>
        ))
      }
      else{
        profileItems = (<h4>No profiles found...</h4>)
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="text-center display-4">Developer Profiles</h2>
              <p className="lead text-muted">Browse and connect with developers</p>
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProp = state => ({
    profile: state.profile
})

export default connect(mapStateToProp, {getProfiles})(Profiles)