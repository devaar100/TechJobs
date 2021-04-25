import React, { Component } from 'react';
import axios from 'axios';
import fire from '../fire'
const URL = 'https://techjobs100.herokuapp.com/'
// const URL = 'http://localhost:4000/'

export default class EditProfile extends Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: fire.auth().currentUser.displayName,
            email: fire.auth().currentUser.email,
            uid: fire.auth().currentUser.uid,
            year: '1st',
            gender: 'Female',
            college: 'DTU',
            college_full: 'Delhi College of Engineering',
            branch: 'Computer & related',
            branch_full: 'Computer Science',
            cgpa: '8+',
            cc: '',
            cc_rating: '0',
            cf: '',
            cf_rating: '0',
            linkedin: '',
            resume: '',
            github: '',
            open_source: '',
            work_ex: '',
            miscellaneous: ''
        }
    }

    componentDidMount() {
        console.log('Request sent')
        axios.get(`${URL}profiles/` + fire.auth().currentUser.uid)
            .then(response => {
                this.setState(Object.assign({}, response.data))
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onChange(e) {
        this.setState(Object.assign({}, this.state, e))
    }

    onSubmit(e) {
        e.preventDefault();
        const obj = this.state
        axios.post(`${URL}profiles/update/` + fire.auth().currentUser.uid, obj)
            .then(res => {
                if(res.status === 200) {
                    console.log(res.data)
                    alert('Profile updated successfully !')
                }
            });

        this.props.history.push('/all');
    }

    render() {
        return (
            <div className="container col-5">
                <h3 align="center">{fire.auth().currentUser.displayName}'s Profile</h3>
                <h6 align="center">If any field is not applicable or not available kindly leave it at default state</h6>
                <br/><br/>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Name</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.name}
                                onChange={val => this.onChange({name: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input
                                type="email"
                                className="form-control"
                                value={this.state.email}
                                onChange={val => this.onChange({email: val.target.value})}
                            />
                        </div>
                    </div>
                    <fieldset className="form-group">
                        <div className="row">
                            <legend className="col-form-label col-sm-2 pt-0">Gender</legend>
                            <div className="col-sm-10">
                                <div className="form-check">
                                    <input
                                        checked={this.state.gender==='Male'}
                                        onChange={val => this.onChange({gender: val.target.value})}
                                        className="form-check-input" type="radio" value="Male"/>
                                        <label className="form-check-label" htmlFor="gridRadios1">
                                            Male
                                        </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        checked={this.state.gender==='Female'}
                                        onChange={val => this.onChange({gender: val.target.value})}
                                        className="form-check-input" type="radio" value="Female"/>
                                        <label className="form-check-label" htmlFor="gridRadios2">
                                            Female
                                        </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">College</label>
                        <div className="col-sm-10">
                            <select
                                className="custom-select"
                                defaultValue={this.state.college}
                                onChange={val => this.onChange({college: val.target.value})}>
                                <option value="IIT" selected={this.state.college==='IIT'}>IIT</option>
                                <option value="NIT" selected={this.state.college==='NIT'}>NIT</option>
                                <option value="DTU" selected={this.state.college==='DTU'}>DTU</option>
                                <option value="NSIT" selected={this.state.college==='NSIT'}>NSIT</option>
                                <option value="IIIT" selected={this.state.college==='IIIT'}>IIIT</option>
                                <option value="VIT" selected={this.state.college==='VIT'}>VIT</option>
                                <option value="BITS" selected={this.state.college==='BITS'}>BITS</option>
                                <option value="Other" selected={this.state.college==='Other'}>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">College Full Name</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.college_full}
                                onChange={val => this.onChange({college_full: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Branch</label>
                        <div className="col-sm-10">
                            <select
                                className="custom-select"
                                defaultValue={this.state.branch}
                                onChange={val => this.onChange({branch: val.target.value})}>
                                <option value="Computer & related" selected={this.state.branch==='Computer & related'}>Computer & related</option>
                                <option value="Electrical & related" selected={this.state.branch==='Electrical & related'}>Electrical & related</option>
                                <option value="Mechanical & related" selected={this.state.branch==='Mechanical & related'}>Mechanical & related</option>
                                <option value="Other" selected={this.state.branch==='Other'}>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Branch Full Name</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.branch_full}
                                onChange={val => this.onChange({branch_full: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Year</label>
                        <div className="col-sm-10">
                            <select
                                className="custom-select"
                                defaultValue={this.state.year}
                                onChange={val => this.onChange({year: val.target.value})}>
                                <option value="1st" selected={this.state.year==='1st'}>1st</option>
                                <option value="2nd" selected={this.state.year==='2nd'}>2nd</option>
                                <option value="3rd" selected={this.state.year==='3rd'}>3rd</option>
                                <option value="4th" selected={this.state.year==='4th'}>4th</option>
                                <option value="5th" selected={this.state.year==='5th'}>5th</option>
                                <option value="Recent graduate" selected={this.state.year==='Recent graduate'}>Recent graduate</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">CGPA</label>
                        <div className="col-sm-10">
                            <select
                                className="custom-select"
                                defaultValue={this.state.cgpa}
                                onChange={val => this.onChange({cgpa: val.target.value})}>
                                <option value="Below 8" selected={this.state.cgpa==='Below 8'}>Below 8</option>
                                <option value="8+" selected={this.state.cgpa==='8+'}>8+</option>
                                <option value="8.5+" selected={this.state.cgpa==='8.5+'}>8.5+</option>
                                <option value="9+" selected={this.state.cgpa==='9+'}>9+</option>
                                <option value="9.5+" selected={this.state.cgpa==='9.5+'}>9.5+</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">CodeChef link</label>
                        <div className="col-sm-10">
                            <input
                                type="url"
                                className="form-control"
                                value={this.state.cc}
                                onChange={val => this.onChange({cc: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">CodeChef Max Rating</label>
                        <div className="col-sm-10">
                            <input
                                type="number"
                                className="form-control"
                                value={this.state.cc_rating}
                                onChange={val => this.onChange({cc_rating: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">CodeForces link</label>
                        <div className="col-sm-10">
                            <input
                                type="url"
                                className="form-control"
                                value={this.state.cf}
                                onChange={val => this.onChange({cf: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">CodeForces Max Rating</label>
                        <div className="col-sm-10">
                            <input
                                type="number"
                                className="form-control"
                                value={this.state.cf_rating}
                                onChange={val => this.onChange({cf_rating: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">LinkedIn profile link</label>
                        <div className="col-sm-10">
                            <input
                                type="url"
                                className="form-control"
                                value={this.state.linkedin}
                                onChange={val => this.onChange({linkedin: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Resume link</label>
                        <div className="col-sm-10">
                            <input
                                type="url"
                                className="form-control"
                                value={this.state.resume}
                                onChange={val => this.onChange({resume: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Github link</label>
                        <div className="col-sm-10">
                            <input
                                type="url"
                                className="form-control"
                                value={this.state.github}
                                onChange={val => this.onChange({github: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Open source experience</label>
                        <div className="col-sm-10">
                            <input
                                maxLength={100}
                                type="text"
                                placeholder={"Max 100 chars"}
                                className="form-control"
                                value={this.state.open_source}
                                onChange={val => this.onChange({open_source: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Work experience</label>
                        <div className="col-sm-10">
                            <input
                                maxLength={100}
                                type="text"
                                className="form-control"
                                placeholder={"Max 100 chars"}
                                value={this.state.work_ex}
                                onChange={val => this.onChange({work_ex: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Miscellaneous</label>
                        <div className="col-sm-10">
                            <input
                                maxLength={100}
                                type="text"
                                className="form-control"
                                placeholder={"Max 100 chars"}
                                value={this.state.miscellaneous}
                                onChange={val => this.onChange({miscellaneous: val.target.value})}
                            />
                        </div>
                    </div>
                    <br/>
                    <div className="form-group">
                        <input type="submit" value="Update Profile" className="btn btn-primary" />
                    </div>
                    <br/>
                    <br/>
                </form>
            </div>
        )
    }
}
