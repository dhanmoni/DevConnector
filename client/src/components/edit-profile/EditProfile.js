import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import InputGroup from '../common/InputGroup'
import SelectListGroup from '../common/SelectListGroup'
import {createProfile, getCurrentProfile} from '../../actions/profileActions'
import isEmpty from '../../validation/is-empty'

class EditProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            displaySocialInputs: false,
            handle:'',
            company:'',
            website:'',
            location:'',
            status:'',
            skills:'',
            
            bio:'',
            twitter:'',
            facebook:'',
            linkedin:'',
            instagram:'',
            youtube:'',
            errors:{}

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

    }

   componentWillReceiveProps(nextProps) {
       if(nextProps.errors) {
           this.setState({errors: nextProps.errors})
       }
       if(nextProps.profile.profile){
           const profile = nextProps.profile.profile;

           //bring skills array to CSV
           const skillsCSV = profile.skills.join(',')
            //If profile field doesnot exist then make an empty string
            profile.company = !isEmpty(profile.company) ? profile.company : '';
            profile.website = !isEmpty(profile.website) ? profile.website : '';
            profile.location = !isEmpty(profile.location) ? profile.location : '';
            profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
            profile.social = !isEmpty(profile.social) ? profile.social : {};
            profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
            profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
            profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';
            profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';
            profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';

            //set component state
            this.setState({
                handle: profile.handle,
                company: profile.company,
                location: profile.location,
                website: profile.website,
                status: profile.status,
                skills: skillsCSV,
                bio: profile.bio,
                twitter: profile.twitter,
                facebook: profile.facebook,
                youtube: profile.youtube,
                linkedin: profile.linkedin,
                instagram: profile.instagram,
            })

       }
   }

   componentDidMount(){
       this.props.getCurrentProfile()
   }

    onSubmit(e){
        e.preventDefault();
        const profileData = {
            handle: this.state.handle,
            company: this.state.company,
            location: this.state.location,
            website: this.state.website,
            status: this.state.status,
            skills: this.state.skills,
            bio: this.state.bio,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            youtube: this.state.youtube,
            linkedin: this.state.linkedin,
            instagram: this.state.instagram,

        }
        this.props.createProfile(profileData, this.props.history)
    }
    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

  render() {
      const {errors, displaySocialInputs} = this.state;

      let socialInputs;
      if(displaySocialInputs){
        socialInputs = (
            <div>
                <InputGroup
                 placeholder="Twitter Profile URL"
                 name="twitter"
                 icon="fab fa-twitter"
                 
                 onChange={this.onChange}
                 value={this.state.twitter}
                 errors={errors.twitter}
                />
                <InputGroup
                 placeholder="Facebook Profile URL"
                 name="facebook"
                 icon="fab fa-facebook"
                 value={this.state.facebook}
                 onChange={this.onChange}
                
                 errors={errors.facebook}
                />
                <InputGroup
                 placeholder="Instagram Profile URL"
                 name="instagram"
                 icon="fab fa-instagram"
                 value={this.state.instagram}
                 onChange={this.onChange}
                 
                 errors={errors.instagram}
                />
                <InputGroup
                 placeholder="Youtube Profile URL"
                 name="youtube"
                 icon="fab fa-youtube"
                 value={this.state.youtube}
                 onChange={this.onChange}
                 
                 errors={errors.youtube}
                />
                 <InputGroup
                 placeholder="Linkedin Profile URL"
                 name="linkedin"
                 icon="fab fa-linkedin"
                 value={this.state.linkedin}
                 onChange={this.onChange}
                 
                 errors={errors.linkedin}
                />
            </div>
        )
      }

      const options = [
          {label: '* Select Professional Status', value:0},
          {label:'Developer', value:'Developer'},
          {label:'Senior Developer', value:'Senior Developer'},
          {label:'Junior Developer', value:'Junior Developer'},
          {label:'Manager', value:'Manager'},
          {label:'Student or Learning', value:'Student or Learning  '},
          {label:'Instructor or Teacher', value:'Instructor or Teacher'},
          {label:'Intern', value:'Intern'},
          {label:'Other', value:'Other'}
      ];

    return (
      <div className="create-profile">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 m-auto">
                    <Link to="/dashboard" className="btn btn-light">
                    Go Back
                 </Link>
                        <h1 className="display-4 text-center">Edit Profile</h1>
                        <small className="d-block pb-3">* = required field</small>
                        <form onSubmit={this.onSubmit}>
                            <TextFieldGroup 
                                placeholder="* Profile Handle"
                                name="handle"
                                value={this.state.handle}
                                onChange={this.onChange}
                                errors={errors.handle}
                                info="A unique handle for your profile URL. Your full name, Company name, nickname"
                            />

                            <SelectListGroup 
                                placeholder="* Status"
                                name="status"
                                value={this.state.status}
                                onChange={this.onChange}
                                options={options}
                                errors={errors.status}
                                info="Give us an idea of where are you at in your career"
                            />
                             <TextFieldGroup 
                                placeholder="Company"
                                name="company"
                                value={this.state.company}
                                onChange={this.onChange}
                                errors={errors.company}
                                info="Could be your own company or one you work for"
                            />
                             <TextFieldGroup 
                                placeholder="Website"
                                name="website"
                                value={this.state.website}
                                onChange={this.onChange}
                                errors={errors.website}
                                info="Could be your own website or a company one"
                            />
                            <TextFieldGroup 
                                placeholder="Location"
                                name="location"
                                value={this.state.location}
                                onChange={this.onChange}
                                errors={errors.location}
                                info="City or city & state suggested (eg. Guwahati, Assam)"
                            />
                            <TextFieldGroup 
                                placeholder="Skills"
                                name="skills"
                                value={this.state.skills}
                                onChange={this.onChange}
                                errors={errors.skills}
                                info="Please use comma seperated values (eg. JavaScript, PHP, HTML, CSS)"
                            />
                           
                            <TextAreaFieldGroup
                                 placeholder="Short Bio"
                                name="bio"
                                value={this.state.bio}
                                onChange={this.onChange}
                                errors={errors.bio}
                                info="Tell us a little about yourself"
                            />
                            <div className="mb-3">
                                <button
                                type="button"
                                    onClick={()=>{
                                        this.setState(prevState => ({
                                            displaySocialInputs: !prevState.displaySocialInputs
                                        }))
                                       
                                    }}
                                >
                                  Add social network links
                                </button>
                                <span className="text-muted"> Optional</span>
                            </div>
                            {socialInputs}
                            <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/> 
                            
                        </form>

                         
                    </div>
                </div>
            </div>
      </div>
    )
  }
}
EditProfile.proptypes = {
    createProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,

}

const mapStateToProps = state =>({
    profile: state.profile,
    errors: state.errors
})
export default connect(mapStateToProps, {createProfile, getCurrentProfile})(withRouter(EditProfile))