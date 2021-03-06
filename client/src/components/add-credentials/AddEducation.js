import React, { Component } from 'react'
import {Link,withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import { addEducation} from '../../actions/profileActions'

class AddEducation extends Component {

    constructor(props){
        super(props);
        this.state = {
            school:'',
            degree:'',
            fieldofstudy:'',
            from:'',
            to:'',
            current: false,
            description:'',
            errors: {},
            disabled: false

        };
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onCheck = this.onCheck.bind(this)

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }
    }

    onSubmit(e){
        e.preventDefault();
         const eduData = {
             school: this.state.school,
             degree: this.state.degree,
             fieldofstudy: this.state.fieldofstudy,
             from: this.state.from,
             to: this.state.to,
             current: this.state.current,
             description: this.state.description,
         }
         this.props.addEducation(eduData, this.props.history)
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onCheck(){
        this.setState({
            disabled: !this.state.disabled,
            current: !this.state.current
        })
    }

    render() {
     const { errors } = this.state

    return (
        <div className="add-experience">
            <div className="container">
              <div className="row">
                <div className="col-md-8 m-auto">
                 
                 <Link to="/dashboard" className="btn btn-light">
                    Go Back
                 </Link>
                <h1 className="display-4 text-center">Add education</h1>
                <p className="lead text-center">Add your school, degree and field of study</p>
                <small className="d-block pb-3" >*= required field</small>
                <form onSubmit={this.onSubmit}>
                    <TextFieldGroup
                        placeholder="Add your School"
                        name="school"
                        value={this.state.school}
                        onChange={this.onChange}
                        errors={errors.school}
                    />
                    <TextFieldGroup
                        placeholder="Degree"
                        name="degree"
                        value={this.state.degree}
                        onChange={this.onChange}
                        errors={errors.degree}
                    />
                    <TextFieldGroup
                        placeholder="Field of study"
                        name="fieldofstudy"
                        value={this.state.fieldofstudy}
                        onChange={this.onChange}
                        errors={errors.fieldofstudy}
                    />
                    <h6>From Date</h6>
                    <TextFieldGroup
                        name="from"
                        type="date"
                        value={this.state.from}
                        onChange={this.onChange}
                        errors={errors.from}
                    />
                    <h6>To Date</h6>
                    <TextFieldGroup
                        name="to"
                        type="date"
                        value={this.state.to}
                        onChange={this.onChange}
                        errors={errors.to}
                        disabled={this.state.disabled ? 'disabled' : ''}
                    />
                    <div className="form-check mb-4">
                    <input
                        type="checkbox"
                        name="current"
                        className="form-check-input"
                        value={this.state.current}
                        checked={this.state.current}
                        onChange={this.onCheck}
                        id="current"
                    />
                    <label htmlFor="current" className="form-check-label">Current School</label>
                    </div>
                    <TextAreaFieldGroup
                        placeholder="Description"
                        name="description"
                        value={this.state.description}
                        onChange={this.onChange}
                        errors={errors.description}
                        info="Tell us about the your education"
                    />
                    <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>
                </form>
                </div>
              </div>
            </div>        
        </div>
    )
    }
}
AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,

}
const mapStateToProp = (state) => ({
    profile: state.profile,
    errors: state.errors
})

export default connect(mapStateToProp , {addEducation})(withRouter(AddEducation))