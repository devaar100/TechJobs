import React, { Component } from 'react';
import axios from 'axios';
import fire from '../fire'
const URL = 'https://techjobs100.herokuapp.com/'
// const URL = 'http://localhost:4000/'

export default class EditJob extends Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            postedBy: fire.auth().currentUser.uid,
            dateCreated: new Date().getMilliseconds(),
            isAccepting: false,
            company: '',
            profile: '',
            openFor: '',
            description: '',
            profileURL: '',
            applicants: []
        }

        if(this.props.location.state.job) {
            this.setState(Object.assign( this.state, this.props.location.state.job))
        }
    }

    onChange(e) {
        this.setState(Object.assign({}, this.state, e))
    }

    onSubmit(e) {
        e.preventDefault();
        const obj = this.state
        const id = this.state._id || 'create'
        axios.post(`${URL}jobs/update/`+id, obj)
            .then(res => {
                if(res.status === 200) {
                    console.log(res.data)
                    alert('Posting updated successfully !')
                }
            });

        this.props.history.push('/');
    }

    render() {
        return (
            <div className="container col-5">
                <h3 align="center">{this.props.job ? 'Edit post' : 'Create post'}</h3>
                <h6 align="center">If any field is not available kindly leave it empty</h6>
                <br/><br/>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Company</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.company}
                                onChange={val => this.onChange({company: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Profile</label>
                        <div className="col-sm-10">
                            <input
                                placeholder={"Software developer / QA / Intern etc"}
                                type="text"
                                className="form-control"
                                value={this.state.profile}
                                onChange={val => this.onChange({profile: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Open for</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                placeholder={'3rd years / 4th years etc'}
                                className="form-control"
                                value={this.state.openFor}
                                onChange={val => this.onChange({openFor: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Description</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                maxLength={100}
                                placeholder={"Max 100 chars"}
                                value={this.state.description}
                                onChange={val => this.onChange({description: val.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Profile URL</label>
                        <div className="col-sm-10">
                            <input
                                type="url"
                                className="form-control"
                                value={this.state.profileURL}
                                onChange={val => this.onChange({profileURL: val.target.value})}
                            />
                        </div>
                    </div>
                    <fieldset className="form-group">
                        <div className="row">
                            <legend className="col-form-label col-sm-2 pt-0">Accepting</legend>
                            <div className="col-sm-10">
                                <div className="form-check">
                                    <input
                                        checked={this.state.isAccepting}
                                        onChange={val => this.onChange({isAccepting: true})}
                                        className="form-check-input" type="radio" value="true"/>
                                    <label className="form-check-label" htmlFor="gridRadios1">
                                        True
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        checked={!this.state.isAccepting}
                                        onChange={val => this.onChange({isAccepting: false})}
                                        className="form-check-input" type="radio" value="false"/>
                                    <label className="form-check-label" htmlFor="gridRadios2">
                                        False
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <br/>
                    <div className="form-group">
                        <input type="submit" value={this.props.location.state.job ? 'Update post' : 'Create post'} className="btn btn-primary" />
                    </div>
                    <br/>
                    <br/>
                </form>
            </div>
        )
    }
}
