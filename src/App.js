import React from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row, Col,
  Image, Navbar,
  Button
} from "react-bootstrap"
import Select from "react-select"

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
    this.state = { pager: {} };
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
    this.setState({ pager: pager });

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
    const companies = [
        {value: 1, label: "Amazon"},
        {value: 2, label: "Google"},
        {value: 3, label: "Facebook"},
        {value: 4, label: "Microsoft"},
        {value: 5, label: "Cure.Fit"},
        {value: 6, label: "Goldman Sachs"},
        {value: 7, label: "American Express"},
        {value: 8, label: "Expedia"},
        {value: 9, label: "Visa"},
        {value: 10, label: "Bloomberg"},
        {value: 11, label: "Gameskraft"},
        {value: 12, label: "United Health Group"},
        {value: 13, label: "Uber"},
        {value: 14, label: "Flipkart"},
        {value: 15, label: "Myntra"},
        {value: 16, label: "Walmart Labs"},
        {value: 17, label: "Code Nation"},
        {value: 18, label: "DE Shaw"},
        {value: 19, label: "Ola"},
        {value: 20, label: "Swiggy"},
        {value: 21, label: "Zomato"},
        {value: 22, label: "TCS"},
        {value: 23, label: "Bank of America"},
        {value: 24, label: "MongoDB"},
        {value: 25, label: "Deutsche Bank"},
        {value: 26, label: "ZS Associates"},
        {value: 27, label: "Paypal"},
        {value: 28, label: "Paytm"},
        {value: 29, label: "Atlassian"},
        {value: 30, label: "SAP Labs"},
        {value: 31, label: "Urban Company"},
        {value: 32, label: "Gojek Tech"},
        {value: 33, label: "Rubrik"},
        {value: 34, label: "Sprinklr"},
        {value: 35, label: "Oracle"},
        {value: 36, label: "BookMyShow"},
        {value: 37, label: "ByteDance"},
        {value: 38, label: "Olx"},
        {value: 39, label: "Salesforce"},
        {value: 40, label: "LinkedIn"},
        {value: 41, label: "Open Source / Hackathons"}
      ]
    this.state = {
      loading: true,
      jobs: [],
      filteredJobs: [],
      pageOfItems: [],
      selectOptions : companies,
      value: companies,
      selectOptions2 : [
        {value: 1, label: "2nd year"},
        {value: 2, label: "3rd year"},
        {value: 3, label: "4th year"}],
      value2: {value: 3, label: "4th year"}
    };

    this.onChangePage = this.onChangePage.bind(this);
  }

  componentDidMount() {
    fetch("https://techjobs-46b44.firebaseio.com/.json")
        .then(res => res.json())
        .then((result) => {
              this.setState({
                jobs: result,
                loading: false,
              })
              this.updateJobs({})
            },
            (error) => {
              console.log("Error")
              // set error state
            }
        )
  }

  onChangePage(pageOfItems) {
    this.setState({ pageOfItems: pageOfItems });
  }

  updateJobs(update){
    const newState = {...this.state, ...update}
    const companyFilter = newState.value.map(item => item.label)
    const yearFilter = parseInt(newState.value2.label[0])

    if(companyFilter.length) {
      const filteredJobs = newState.jobs.filter(item => companyFilter.indexOf(item.company)!==-1 && item.year===yearFilter)
      this.setState({
        filteredJobs: filteredJobs,
        ...update
      })
    } else{
      this.setState({
        filteredJobs: [],
        ...update
      })
    }
  }

  handleChange(e){
    if(e===null || e.length===0) e = this.state.selectOptions
    this.updateJobs({value: e})
  }

  handleChange2(e){
    this.updateJobs({value2: e})
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
              <h5>Filter by company name</h5>
              <Select options={this.state.selectOptions} onChange={this.handleChange.bind(this)} isMulti />
              <br/>
              <h5>Filter by academic year</h5>
              <Select defaultValue={{value: 3, label: "4th year"}} options={this.state.selectOptions2} onChange={this.handleChange2.bind(this)} />
              <br/>
              <i>To request job updates about companies not mentioned in company filter, to contribute or
                inform about missing job postings or to join this initiative drop an email at
                aarnavjindal1000@gmail.com or connect with me on linkedin.com/in/aarnavjindal/</i>
            </Col>
            <Col sm={12} md={6} style={styles.jobContainer}>
              {this.state.filteredJobs.length ? this.state.pageOfItems.map(item =>
                  <Row key={item.id}>
                    <Col style={styles.container}>
                      <Row>
                        <Col className="text-center" md={3} lg={2}>
                          <Image src={item.image} style={styles.logo}/>
                        </Col>
                        <Col md={9} lg={10}>
                          <Row style={styles.profile}>
                            {item.position}
                          </Row>
                          <Row style={styles.company}>
                            {item.company}
                          </Row>
                          <Row style={styles.location}>
                            {item.location}
                          </Row>
                          <Row style={styles.company}>
                            {`Date added: ${(new Date(item.date * 1000).toLocaleDateString())}`}
                          </Row>
                        </Col>
                      </Row>
                      <Row style={styles.desc}>
                        {item.desc}
                      </Row>
                      <Row>
                        <Col style={{marginTop: 10, marginBottom: 10}}>
                          <Button onClick={()=>window.open(item.url, "_blank")} variant="primary">Apply on website</Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
              ): <h4>No jobs match the provided filters</h4> }
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
              {this.state.filteredJobs.length ?
                  <Pagination
                      items={this.state.filteredJobs}
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
    padding: 15
  },
  logo: {
    height: 50,
    width: 50,
    margin: 20
  },
  profile: {
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  company: {
    color: "#000000",
    paddingLeft: 20,
    paddingRight: 20,
  },
  location: {
    fontWeight: "bold",
    paddingLeft: 20,
    paddingRight: 20,
  },
  desc: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  jobContainer: {
    height: "78vh",
    overflowY: "scroll"
  }
}

export default App