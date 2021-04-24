import React, { Component } from 'react';
import {
    Container,
    Row, Col
} from "react-bootstrap"
import Select from "react-select"
import PropTypes from "prop-types"
import * as Icons from "react-ionicons";
import axios from 'axios';

const Profile = ({ profile }) => {

    return (
        <Row style={styles.container} key={profile.id}>
            <Col>
                <Row style={styles.text}>{`${profile.name}, ${profile.gender}`}</Row>
                <Row style={styles.text}><a href={profile.email}>{profile.email}</a></Row>
                <Row style={styles.text}>{`${profile.year} year, ${profile.branch_full} ( CGPA - ${profile.cgpa})`}</Row>
                <Row style={styles.text}>{`${profile.college_full} `}</Row>
                <Row style={styles.text}>{"CodeChef Rating -  "}<a href={profile.cc}>{profile.cc_rating}</a></Row>
                <Row style={styles.text}>{"CodeForces Rating -  "}<a href={profile.cf}>{profile.cf_rating}</a></Row>
                <Row style={styles.text}>{`Open source experience - ${profile.open_source}`}</Row>
                <Row style={styles.text}>{`Experience - ${profile.work_ex}`}</Row>
                <Row style={styles.text}>{`Miscellaneous - ${profile.miscellaneous}`}</Row>
                <Row>
                    <Icons.LogoGithub
                        style={styles.icon}
                        height="30px"
                        width="30px"
                        onClick={() => window.open(profile.github, "_blank")}
                    />
                    <Icons.LogoLinkedin
                        style={styles.icon}
                        height="30px"
                        width="30px"
                        onClick={() => window.open(profile.linkedin, "_blank")}
                    />
                    <Icons.Document
                        style={styles.icon}
                        height="30px"
                        width="30px"
                        onClick={() => window.open(profile.resume, "_blank")}
                    />
                </Row>
            </Col>
        </Row>
    )
}


const colleges = [
    {value: 0, label: 'IIT'},
    {value: 1, label: 'NIT'},
    {value: 2, label: 'DTU'},
    {value: 3, label: 'NSIT'},
    {value: 4, label: 'IIIT'},
    {value: 5, label: 'BITS'},
    {value: 6, label: 'VIT'},
    {value: 7, label: 'Other'}
];
const genders = [{value: 0, label: 'Male'}, {value: 1, label: 'Female'}];
const years = [{value: 0, label: '1st'}, {value: 1, label: '2nd'}, {value: 2, label: '3rd'}, {value: 4, label: '4th'}, {value: 4, label: '5th'}];
const sortTypes = [{value: 0, label: 'CodeChef Rating'}, {value: 1, label: 'CodeForces Rating'}, { value: 2, label: 'None'}]
const cgpas = [{value: 0, label: 'Below 8'}, {value: 1, label: '8+'}, {value: 2, label: '8.5+'}, {value: 3, label: '9+'}, {value: 4, label: '9.5+'}];

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
        const pager = this.getPager(items.length, page);

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
            <ul className="pagination">
                <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(1)}>First</a>
                </li>
                <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage - 1)}>Previous</a>
                </li>
                {pager.pages.map((page, index) =>
                    <li key={index} className={pager.currentPage === page ? 'active' : ''}>
                        <a onClick={() => this.setPage(page)}>{page}</a>
                    </li>
                )}
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage + 1)}>Next</a>
                </li>
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.totalPages)}>Last</a>
                </li>
            </ul>
        );
    }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default class ProfileList extends Component {

    componentDidMount() {
        axios.get('http://tech-jobs.in/profiles/')
            .then(response => {
                console.log(response)
                this.setState({
                    profiles: response.data,
                    loading: false,
                })
                this.updateProfiles({})
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
            colleges: colleges,
            selectedColleges: colleges.map(item => item.label),
            genders: genders,
            selectedGenders: genders.map(item => item.label),
            sortTypes: sortTypes,
            selectedSortType: sortTypes[2].label,
            years: years,
            selectedYears: years.map(item => item.label),
            cgpas: cgpas,
            selectedCGPAs: cgpas.map(item => item.label),
            profiles: null,
            selectedProfiles: null
        };

        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(pageOfItems) {
        this.setState({pageOfItems: pageOfItems});
    }

    updateProfiles(update) {
        let newState = Object.assign({}, this.state, update)
        let selectedProfiles = this.state.profiles.filter(profile => {
            return (
                newState.selectedGenders.includes(profile.gender) &&
                newState.selectedColleges.includes(profile.college) &&
                newState.selectedYears.includes(profile.year) &&
                newState.selectedCGPAs.includes(profile.cgpa)
            )
        })
        if(newState.selectedSortType !== 'None' ) {
            switch (update['selectedSortType']) {
                case 'CodeChef Rating' :
                    selectedProfiles = selectedProfiles.sort((p1, p2) => p2.cc_rating - p1.cc_rating)
                    break;
                case 'CodeForces Rating' :
                    selectedProfiles = selectedProfiles.sort((p1, p2) => p2.cf_rating - p1.cf_rating)
                    break;
            }
        }
        newState = Object.assign({}, newState, {selectedProfiles: selectedProfiles})
        this.setState(newState)
    }

    handleColleges(e) {
        if (e === null || e.length === 0) e = this.state.colleges
        e = e.map(item => item.label)
        this.updateProfiles({selectedColleges: e})
    }

    handleSortType(e) {
        if (e === null || e.length === 0) e = this.state.sortTypes[2].label
        e = e.label
        this.updateProfiles({selectedSortType: e})
    }

    handleGender(e) {
        if (e === null || e.length === 0) e = this.state.genders
        e = e.map(item => item.label)
        this.updateProfiles({selectedGenders: e})
    }

    handleYears(e) {
        if (e === null || e.length === 0) e = this.state.years
        e = e.map(item => item.label)
        this.updateProfiles({selectedYears: e})
    }

    handleCGPAs(e) {
        if (e === null || e.length === 0) e = this.state.cgpas
        e = e.map(item => item.label)
        this.updateProfiles({selectedCGPAs: e})
    }

    render() {
        return (
            <>
                <Container fluid>
                    <Row>
                        <Col sm={12} md={3} style={{padding: 20, paddingTop: 15}}>
                            <h6>Filter by college</h6>
                            <Select options={this.state.colleges} onChange={this.handleColleges.bind(this)} isMulti/>
                            <br/>
                            <h6>Filter by year</h6>
                            <Select options={this.state.years} onChange={this.handleYears.bind(this)} isMulti/>
                            <br/>
                            <h6>Filter by gender</h6>
                            <Select options={this.state.genders} onChange={this.handleGender.bind(this)} isMulti/>
                            <br/>
                            <h6>Filter by cgpa</h6>
                            <Select options={this.state.cgpas} onChange={this.handleCGPAs.bind(this)} isMulti/>
                            <br/>
                            <h6>Sort by platform rating</h6>
                            <Select defaultValue={this.state.sortTypes[2]} options={this.state.sortTypes}
                                    onChange={this.handleSortType.bind(this)}/>
                            <br/>
                        </Col>
                        <Col sm={12} md={6}>
                            {this.state.selectedProfiles?.length ? this.state.pageOfItems.map((item, index) =>
                                <Profile profile={item} index={index}/> ) :
                                <h5>No profiles match the provided filters</h5>
                            }
                        </Col>
                        <Col sm={12} md={3} style={{padding: 15, paddingLeft: 25, paddingRight: 25, fontSize: 16}}>
                            <i>A lifetime ago, I too sought the stones. I even held one in my hand. But it cast me out,
                                banished me here, guiding others to a treasure I cannot possess.</i>
                            <br/>
                            <br/>
                            I have been a prey to missing out on important opportunities simply because I wasn't aware
                            of their existence. This initiative is to help all college students out there never to miss
                            important job listings from top-notch companies
                        </Col>
                    </Row>
                    <Row className="text-center">
                        <Col xs={1}/>
                        <Col xs={10}>
                            {this.state.selectedProfiles?.length ?
                                <Pagination
                                    items={this.state.selectedProfiles}
                                    onChangePage={this.onChangePage}/> : null
                            }
                        </Col>
                        <Col xs={1}/>
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
