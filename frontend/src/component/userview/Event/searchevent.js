import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import cookie from "react-cookies";
import axios from "axios"
import Navbar from "../uNavbar";
import swal from "sweetalert2";

// import Modal from 'react-modal';
class SearchEvent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      eventdata: []
    };
  }

  componentDidMount() {
    const self = this;
    const eventname = localStorage.getItem("searcheve");
    const data = { eventname };
    console.log(data);
    var bearer = localStorage.getItem('token');
    console.log('Token :', bearer)
    fetch('/searchevent', {
      method: 'POST',
      headers: {
        'Authorization': bearer,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    }).then((data) => {
      self.setState({ eventdata: data });
    }).catch((err) => {
      console.log('caught it!', err);
    });
  }
  viewdetailsHandler(_id)  {
    return function () {
      
      console.log("event ID:", _id);
      localStorage.setItem('event_id_selected',_id);
      return <Redirect to="/vieweventdetails" />;
    };
  };

  handleClick(event_id, restaurant_id) {
    return function () {
      const user_id = cookie.load('cookie1');
      var bearer = localStorage.getItem('token');
      console.log('Token :', bearer)
      console.log(event_id, restaurant_id, user_id);
      const newdata = {
        user_id,
        restaurant_id,
        event_id
      };
      console.log(newdata);
      fetch("/eventsignup", {
        method: "POST",
        headers: {
          'Authorization': bearer,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newdata),
      }).then((response) => {
        console.log("inside success");
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log("success", response);
          //alert("successfully registered for event");
          swal.fire({
            title: "Success!",
            text: "Successfully registered for event",
            icon: "success",
          });
          window.location.reload();
          // console.log(response)
        }
      })
        .catch((err) => {
          console.log("In error");
          console.log(err);
          alert("Failed", "Update failed! Please try again", err);
        });
    };
  }

  render() {
    let redirectVar = null;
    if (!cookie.load("cookie1")) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div>
        {redirectVar}
        <div>
          <div>
            <Navbar />
            <div className="container">
              <h1 className="heading-menu"> Events</h1>
              <br />
              <br />

              <div className="panel panel-default p50 uth-panel">

                <table className="table table-hover">
                  <thead>
                    <tr className="tbl-header">
                      <th>Event Name</th>
                      <th>Event Description</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Address</th>
                      <th>Sign Up</th>
                      <th>View Details</th>


                    </tr>
                  </thead>
                  <tbody>
                    {this.state.eventdata.map(event => (
                      <tr>
                        <td>
                          {event.eventname}
                          {' '}
                        </td>
                        <td>
                          {event.eventdescription}
                          {' '}
                        </td>
                        <td>
                          {event.date}
                          {' '}
                        </td>
                        <td>
                          {event.time}
                          {' '}
                        </td>
                        <td>{event.address}</td>
                        <td>
                          <Link>
                            <button
                              onClick={this.handleClick(event._id, event.restaurant_id)}
                            >
                              Sign Up
                            </button>
                          </Link>
                        </td>

                          <td>

                          <Link to='/vieweventdetails'>
                            <button
                              onClick={this.viewdetailsHandler(event._id)}
                            >
                              View Details
                            </button>
                          </Link>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SearchEvent;
