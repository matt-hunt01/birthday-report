import React, { Component } from "react";
import config from "./utils/config";
import moment from "moment";
import phone from "./assets/images/phone.png";
import arrow from "./assets/images/arrow.png";
import cake from "./assets/images/cake.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import mail from "./assets/images/mail.png";
import { removeHead, formatPhoneNumber } from "./utils/helper";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      startDate: "1950-01-01",
      endDate: "2018-01-01",
      selectedStartDate: null,
      selectedEndDate: null
    };
    this.filter = this.filter.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
  }

  async componentDidMount() {
    let { data } = await axios.post(
      `${config.baseUrl}/reports/indexEngine/birthday`,
      { startDate: "1950-01-01", endDate: "2018-01-01" },
      {
        headers: {
          Authorization: config.token
        }
      }
    );
    const { data: results } = data;
    removeHead(results);
    this.setState({ results: results });
  }

  onStartDateChange(e) {
    let startDate = moment(e).format("YYYY-MM-DD");
    this.setState({ startDate, selectedStartDate: e });
  }

  onEndDateChange(e) {
    let endDate = moment(e).format("YYYY-MM-DD");
    this.setState({ endDate, selectedEndDate: e });
  }

  async filter(e) {
    e.preventDefault();
    let { data } = await axios.post(
      `${config.baseUrl}/reports/indexEngine/birthday`,
      { startDate: this.state.startDate, endDate: this.state.endDate },
      {
        headers: {
          Authorization: config.token
        }
      }
    );
    const { data: results } = data;
    removeHead(results);
    this.setState({ results: results });
  }

  render() {
    if (!this.state.results) {
      return (
        <div className="App">
          <h2>no results</h2>
        </div>
      );
    }
    return (
      <div className="App">
        {/* top section */}
        <div className="top-strip">
          <div className="container-fluid">
            <div className="row no-gutters align-items-center">
              <div className="col-md-6">
                <div className="events-notification">
                  <ul>
                    <li>
                      <p>
                        Birthdays Today<span>0</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        Birthdays This Week<span>0</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        Birthdays This Month<span>0</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="date-fltr">
                  <form>
                    <div className="form-group">
                      <DatePicker
                        className="form-control"
                        placeholderText="Start Date"
                        dateFormat="DD-MM-YYYY"
                        onChange={this.onStartDateChange}
                        selected={this.state.selectedStartDate}
                      />
                    </div>
                    <div className="form-group">
                      <DatePicker
                        className="form-control"
                        placeholderText="End Date"
                        dateFormat="DD-MM-YYYY"
                        onChange={this.onEndDateChange}
                        selected={this.state.selectedEndDate}
                      />
                    </div>
                    <button type="submit" onClick={this.filter}>
                      {" "}
                      Filter
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* top section end */}

        {/* table start */}
        <div className="table-wrapper">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Contact</th>
                  <th scope="col">Years</th>
                  <th scope="col">Date</th>
                  <th scope="col">Contact Information</th>
                  <th scope="col">User</th>
                </tr>
              </thead>
              <tbody>
                {this.state.results.map(item => (
                  <tr key={item.id}>
                    <td scope="row">
                      <img src={cake} alt="" />
                    </td>
                    <td>{`${item["contact.firstName"]} ${
                      item["contact.lastName"]
                    }`}</td>
                    <td>{moment().diff(item.birthday, "years")}</td>
                    <td>{moment(item.birthday).format("MMM. DD")}</td>
                    <td>
                      <ul>
                        <li>
                          <img src={phone} alt="" />{" "}
                          <a href="#">
                            {!item["contact.phoneHome"]
                              ? "Home Phone not available"
                              : formatPhoneNumber(
                                  `${item["contact.phoneHome"]}`
                                )}
                          </a>
                        </li>
                        <li>
                          <img src={phone} alt="" />{" "}
                          <a href="">
                            {!item["contact.phoneMobile"]
                              ? "Mobile number not available"
                              : formatPhoneNumber(
                                  `${item["contact.phoneMobile"]}`
                                )}
                          </a>
                        </li>
                        <li>
                          <img src={mail} alt="" />{" "}
                          <a href="">
                            {!item["contact.contactInfo"]
                              ? "No email available"
                              : item &&
                                item["contact.contactInfo"] &&
                                item["contact.contactInfo"]["contact.email"]}
                          </a>
                        </li>
                      </ul>
                    </td>
                    <td>{!item.user ? "User not available" : item.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* table end */}

        {/* <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#">
                <img src={arrow} alt="" />
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          </ul>
        </nav> */}
      </div>
    );
  }
}

export default App;
