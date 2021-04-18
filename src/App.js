import React from "react";
import {
    Container,
    Row, Col,
    Image, Navbar,
    Button
} from "react-bootstrap"
import Select from "react-select"
import PropTypes from "prop-types";
import * as Icons from "react-ionicons";

const colleges = [
    {value: 0, label: 'IIT'},
    {value: 1, label: 'NIT'},
    {value: 2, label: 'DTU'},
    {value: 3, label: 'NSIT'},
    {value: 4, label: 'IIIT'},
    {value: 5, label: 'BITS'},
    {value: 6, label: 'VIT'},
    {value: 7, label: 'Others'}
];
const genders = [{value: 0, label: 'Male'}, {value: 1, label: 'Female'}];
const types = [{value: 0, label: 'Intern'}, {value: 1, label: 'Full-time'}, {value: 2, label: 'Experienced hire'}];
const openSource = [{value: 0, label: 'GSOC'}, {value: 1, label: 'GSSOC'}, {value: 3, label: 'Hacktoberfest'}, {value: 2, label: 'Others'}];
const sortTypes = [{value: 0, label: 'CodeChef Rating'}, {value: 1, label: 'CodeForces Rating'}, {
    value: 2,
    label: 'None'
}]

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

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            pageOfItems: [],
            colleges: colleges,
            selectedColleges: colleges.map(item => item.label),
            genders: genders,
            selectedGenders: genders.map(item => item.label),
            types: types,
            selectedTypes: types.map(item => item.label),
            sortTypes: sortTypes,
            selectedSortType: sortTypes[2].label,
            openSource: openSource,
            selectedOpenSource: openSource.map(item => item.label),
            profiles: null,
            selectedProfiles: null
        };

        this.onChangePage = this.onChangePage.bind(this);
    }

    componentDidMount() {
        fetch("https://techjobs-46b44.firebaseio.com/.json")
            .then(res => res.json())
            .then((result) => {
                    this.setState({
                        profiles: result,
                        loading: false,
                    })
                    this.updateProfiles({})
                },
                (error) => {
                    console.log("Error")
                    // set error state
                }
            )
    }

    onChangePage(pageOfItems) {
        this.setState({pageOfItems: pageOfItems});
    }

    updateProfiles(update) {
        const newState = Object.assign({}, this.state, update)
        let selectedProfiles = this.state.profiles.filter(profile => {
            return (
                newState.selectedGenders.includes(profile.gender) &&
                newState.selectedColleges.includes(profile.college) &&
                newState.selectedTypes.includes(profile.type)
            )
        })
        if (update.hasOwnProperty('selectedSortType')) {
            switch (update['selectedSortType']) {
                case 'CodeChef Rating' :
                    selectedProfiles = selectedProfiles.sort((p1, p2) => p2.ccrating - p1.ccrating)
                    break;
                case 'CodeForces Rating' :
                    selectedProfiles = selectedProfiles.sort((p1, p2) => p2.cfrating - p1.cfrating)
                    break;
            }
            const finalState = Object.assign({}, newState, {selectedProfiles: selectedProfiles})
            this.setState(finalState)
        } else {
            const finalState = Object.assign({}, newState, {selectedProfiles: selectedProfiles})
            this.setState(finalState)
        }
    }

    handleColleges(e) {
        if (e === null || e.length === 0) e = this.state.colleges
        e = e.map(item => item.label)
        this.updateProfiles({selectedColleges: e})
    }

    handleTypes(e) {
        if (e === null || e.length === 0) e = this.state.colleges
        e = e.map(item => item.label)
        this.updateProfiles({selectedTypes: e})
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

    handleOpenSource(e) {
        if (e === null || e.length === 0) e = this.state.openSource
        e = e.map(item => item.label)
        this.updateProfiles({selectedOpenSource: e})
    }

    render() {
        return (
            <>
                <Navbar bg="dark" variant="dark" style={{borderRadius: 0}}>
                    <Navbar.Brand>TechJobs</Navbar.Brand>
                </Navbar>
                <Container fluid>
                    <Row>
                        <Col sm={12} md={3} style={{padding: 20, paddingTop: 15}}>
                            <h5>Filter by college</h5>
                            <Select options={this.state.colleges} onChange={this.handleColleges.bind(this)} isMulti/>
                            <br/>
                            <h5>Filter by job type</h5>
                            <Select options={this.state.types} onChange={this.handleTypes.bind(this)} isMulti/>
                            <br/>
                            <h5>Sort by platform rating</h5>
                            <Select defaultValue={this.state.sortTypes[2]} options={this.state.sortTypes}
                                    onChange={this.handleSortType.bind(this)}/>
                            <br/>
                            <h5>Filter by gender</h5>
                            <Select options={this.state.genders} onChange={this.handleGender.bind(this)} isMulti/>
                            <br/>
                            <h5>Filter by open source experience</h5>
                            <Select options={this.state.openSource} onChange={this.handleOpenSource.bind(this)}
                                    isMulti/>
                            <br/>
                        </Col>
                        <Col sm={12} md={6} style={styles.jobContainer}>
                            {this.state.selectedProfiles?.length ? this.state.pageOfItems.map(item => {
                                    return (
                                        <Row style={styles.container} key={item.id}>
                                            <Col>
                                                <Row style={styles.text}>{item.name}</Row>
                                                <Row style={styles.text}>{item.gender}</Row>
                                                <Row style={styles.text}><a href={item.email}>{item.email}</a></Row>
                                                <Row style={styles.text}>{`College - ${item.college}`}</Row>
                                                <Row style={styles.text}>{"CodeChef Rating -  "}<a
                                                    href={item.cc}>{item.ccrating}</a></Row>
                                                <Row style={styles.text}>{"CodeForces Rating -  "}<a
                                                    href={item.cc}>{item.cfrating}</a></Row>
                                                <Row style={styles.text}>{`Open source experience - ${item.osdetail}`}</Row>
                                                <Row style={styles.text}>{`Experience - ${item.workex}`}</Row>
                                                <Row style={styles.text}>{`Miscellaneous - ${item.misc}`}</Row>
                                                <Row>
                                                    <Icons.LogoGithub
                                                        style={styles.icon}
                                                        height="30px"
                                                        width="30px"
                                                        onClick={() => window.open(item.github, "_blank")}
                                                    />
                                                    <Icons.LogoLinkedin
                                                        style={styles.icon}
                                                        height="30px"
                                                        width="30px"
                                                        onClick={() => window.open(item.linkedin, "_blank")}
                                                    />
                                                    <Icons.Document
                                                        style={styles.icon}
                                                        height="30px"
                                                        width="30px"
                                                        onClick={() => window.open(item.resume, "_blank")}
                                                    />
                                                </Row>
                                            </Col>
                                        </Row>
                                    )
                                }
                            ) : <h4>No jobs match the provided filters</h4>}
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

export default App