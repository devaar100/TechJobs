import React, { Component } from 'react';
import {
    Container,
    Row, Col,
    Pagination as RBPagination
} from "react-bootstrap"
import PropTypes from "prop-types"
import axios from 'axios';
import * as _ from 'lodash';
import fire from "../fire";
const URL = 'https://techjobs100.herokuapp.com/'
// const URL = 'http://localhost:4000/'

const Job = ({ job, onEdit, onView, onAppSubmit, isPersonal }) => {

    const uid = fire.auth().currentUser.uid

    return (
        <Row style={styles.container} key={job.id}>
            <Col>
                {isPersonal && <Row style={{...styles.text, fontWeight: 'bold'}}>{job.isAccepting ? 'Accepting right now' : 'Not accepting applications'}</Row>}
                <Row style={styles.text}>Company - {job.company}</Row>
                <Row style={styles.text}>Profile - {job.profile}</Row>
                {!_.isEmpty(job.profileURL) && <Row style={styles.text}>Profile URL - {job.profileURL}</Row>}
                <Row style={styles.text}>Open for - {job.openFor}</Row>
                <Row style={styles.text}>Description - {job.description}</Row>
                <div style={{flexDirection: 'row', marginTop: 10}}>
                    {job.postedBy!==fire.auth().currentUser.uid &&
                        <button
                            onClick={() => onAppSubmit(uid, job)}
                            disabled={job.uids.includes(uid)}
                            style={{marginLeft: -16}}
                            className="btn btn-primary">{job.uids.includes(uid) ? 'Applied': 'Apply'}</button>
                    }
                    {job.postedBy===fire.auth().currentUser.uid &&
                        <>
                            <button
                                style={{marginLeft: -16}}
                                onClick={() => onEdit(job)}
                                className="btn btn-danger">Edit</button>
                            <button
                                style={{marginLeft: 16}}
                                onClick={() => onView(job._id)}
                                className="btn btn-info">View applications</button>
                        </>
                    }
                </div>
            </Col>
        </Row>
    )
}

const propTypes = {
    items: PropTypes.array.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number
}

const defaultProps = {
    initialPage: 1
}

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pager: {}};
    }

    componentWillMount() {
        // set page if items array isn't empty
        if (this.props.items && this.props.items.length) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
    }

    setPage(page) {
        const items = this.props.items;
        // get new pager object for specified page
        const pager = this.getPager(items.length, page, 5);

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // get new page of items from items array
        const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

        // update state
        this.setState({pager: pager});

        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }

    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        const totalPages = Math.ceil(totalItems / pageSize);

        let startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        const pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        const pager = this.state.pager;

        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }

        return (
            <RBPagination size="lg">
                <RBPagination.First
                    onClick={() => this.setPage(1)}
                    disabled={pager.currentPage === 1}/>
                <RBPagination.Prev
                    onClick={() => this.setPage(pager.currentPage - 1)}
                    disabled={pager.currentPage === 1}/>
                {pager.pages.map((page, index) =>
                    <RBPagination.Item
                        onClick={() => this.setPage(page)}
                        key={index}
                        active={pager.currentPage === page}>
                        {page}
                    </RBPagination.Item>
                )}
                <RBPagination.Next
                    onClick={() => this.setPage(pager.currentPage + 1)}
                    disabled={pager.currentPage === pager.totalPages}/>
                <RBPagination.Last
                    onClick={() => this.setPage(pager.totalPages)}
                    disabled={pager.currentPage === pager.totalPages}/>
            </RBPagination>
        );
    }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default class JobList extends Component {

    componentDidMount() {
        axios.get(`${URL}jobs/`)
            .then(response => {
                console.log(response)
                this.setState({
                    visibleItems: response.data.filter(job => job.isAccepting),
                    jobs: response.data,
                    loading: false,
                })
            })
            .catch(function (error){
                console.log(error);
            })
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            pageOfItems: [],
            jobs: [],
            visibleItems: [],
            showAll: true
        };

        this.onChangePage = this.onChangePage.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onView = this.onView.bind(this);
        this.onAppSubmit = this.onAppSubmit.bind(this);
    }

    onChangePage(pageOfItems) {
        this.setState({pageOfItems: pageOfItems});
    }

    onEdit(job) {
        this.props.history.push({
            pathname: '/job',
            state: {
                job
            }
        })
    }

    onView(id) {
        this.props.history.push({
            pathname: '/all',
            state: {
                id
            }
        })
    }

    showAll(type) {
        if(type) {
            this.setState({
                visibleItems: this.state.jobs.filter(job => job.isAccepting),
                showAll: true
            })
        } else {
            const uid = fire.auth().currentUser.uid
            this.setState({
                visibleItems: this.state.jobs.filter(job => job.postedBy===uid),
                showAll: false
            })
        }
    }

    onAppSubmit(uid, refJob) {
        const newJob = Object.assign({}, refJob)
        newJob.uids.push(uid)

        const jobs = this.state.jobs.map(job => {
            if(job._id === refJob._id) {
                return newJob
            } else {
                return job
            }
        })

        const visibleItems = this.state.visibleItems.map(job => {
            if(job._id === refJob._id) {
                return newJob
            } else {
                return job
            }
        })

        this.setState({
            jobs: jobs,
            visibleItems: visibleItems
        })

        axios.post(`${URL}jobs/apply/` + uid, newJob).then(res => {
            console.log(res.data)
            if(res.data === 'Profile incomplete') {
                alert('Could not apply. Your profile section is incomplete.')
            }
        });
    }

    render() {
        return (
            <>
                <Container fluid>
                    <Row className="justify-content-center" style={{padding: 20}}>
                        <button style={{borderRadius: 15, backgroundColor: 'orange'}} onClick={() => this.showAll(true)} className="btn">All Postings</button>
                        <div style={{width: 40}}/>
                        <button style={{borderRadius: 15, backgroundColor: 'orange'}} onClick={() => this.showAll(false)} className="btn">My Postings</button>
                        <div style={{width: 40}}/>
                        <button style={{borderRadius: 15}} onClick={() => this.onEdit(null)} className="btn btn-success">Add Posting</button>
                    </Row>
                    <Row className="justify-content-center">
                        <Col sm={12} md={6}>
                            {this.state.visibleItems.length ? this.state.pageOfItems.map((item, index) =>
                                    <Job job={item} index={index}
                                         isPersonal={!this.state.showAll}
                                         onAppSubmit={this.onAppSubmit}
                                         onView={this.onView}
                                         onEdit={this.onEdit}/> ) :
                                <h5>No postings available here !</h5>
                            }
                        </Col>
                    </Row>
                    <Row className="justify-content-center" style={{paddingTop: 30, paddingBottom: 50}}>
                        {this.state.visibleItems.length ?
                            <Pagination
                                items={this.state.visibleItems}
                                onChangePage={this.onChangePage}/> : null
                        }
                    </Row>
                </Container>
            </>
        );
    }
}

const styles = {
    container: {
        marginTop: 15,
        marginBottom: 15,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#cccccc",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 25,
        paddingRight: 25
    },
    text: {
        fontSize: 18
    },
    icon: {
        marginTop: 10,
        marginRight: 10
    }
}
