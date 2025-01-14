import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import cookie from "react-cookies";
import Navbar from "../uNavbar";
import MapContainer from "../mapContainer";
import { paginate, pages } from "../../../helperFunctions/paginate";
import axios from "axios";


class AllRestaurant extends React.Component {
  constructor(props) {
    super();
    this.state = {
      resturantlist: [],
      filteredRestaurant: [],
      search1: "",
    };
    this.search1Handler = this.search1Handler.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;
    const self = this;
    const restaurant_id = localStorage.getItem("restaurant_id");
    const data = { restaurant_id };
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios.get("/homeviewrestaurant", data).then((response) => {
      if (response.status === 200) {
        console.log("Printing response", response);
        console.log("Printing Menu", response.data);
        this.setState({
          latlng: response.data.map((d) => ({
            latitude: d.lat,
            longitude: d.lng,
          })),
        });
        this.setState({
          resturantlist: response.data.data,
          filteredRestaurant: paginate(response.data, 1, 7),
          pages: pages(response.data.data, 7),
        });
        console.log(pages);
      } else {
        console.log("error");
      }
    });
  }

  paginatinon = (e) => {
    this.setState({
      filteredRestaurant: paginate(this.state.resturantlist, e, 7),
    });
  };

  search1Handler = async (e) => {
    console.log("Inside search1 change handler");
    await this.setState({
      search1: e.target.value,
    });
  };

  render() {
    let redirectVar = null;
    if (!localStorage.getItem('token')){
      redirectVar = <Redirect to="/UserLogin" />
    }




    let links = [];
    if (this.state.pages > 0) {
      console.log(this.state.pages);
      for (let i = 1; i <= this.state.pages; i++) {
        links.push(
          <li className="page-item" key={i}>
            <a
              className="page-link"
              onClick={() => {
                this.paginatinon(i);
              }}
            >
              {i}
            </a>
          </li>
        );
      }
    }

    let restaurant = this.state.filteredRestaurant.map((food) => {
      return (
        <tr>
          <td>{food.restaurantname} </td>
          <td>
            <img src={food.path} width={150} height={120} mode="fit" />
          </td>

          <td>{food.rdescription} </td>
          <td>{food.contactinfo}</td>
          <td>{food.address}</td>
          <td>{food.location}</td>


          <td>
            <Link to="/rviewprofile">
              <button
                onClick={() => {
                  localStorage.setItem("restaurant_id_allrest", food._id);
                  localStorage.setItem("restaurant_name_allrest", food.restaurantname);
                }}
              >
                View Restaurant
              </button>
            </Link>
          </td>
        </tr>
      );
    });

    return (
      <div>
        {redirectVar}
        <div>
          <div>
            <Navbar />
            <br />
            <br />

            <form
              method="get"
              action="#"
              id="header_find_form"
              class="business-search-form main-search yform u-space-b0 js-business-search-form"
              role="search"
            >
              <div class="arrange arrange--equal arrange--stack-small">
                <div class="arrange_unit">
                  <div class="main-search_suggestions-field search-field-container find-decorator">
                    <label
                      class="pseudo-input business-search-form_input business-search-form_input--find"
                      for="find_desc"
                    >
                      <div class="pseudo-input_wrapper">
                        <span class="pseudo-input_text business-search-form_input-text">
                          Find
                        </span>
                        <span class="pseudo-input_field-holder">
                          <input
                            autocomplete="off"
                            id="find_desc"
                            maxlength="64"
                            name="find_desc"
                            placeholder="Restaurant,Food, City, delivery,Neighborhoods..."
                            onChange={this.search1Handler}
                            class="pseudo-input_field business-search-form_input-field"
                            aria-autocomplete="list"
                            tabindex="1"
                          />
                        </span>
                      </div>
                    </label>
                    <div class="main-search_suggestions suggestions-list-container search-suggestions-list-container hidden">
                      <ul
                        class="suggestions-list"
                        role="listbox"
                        aria-label="Search results"
                      ></ul>
                    </div>
                  </div>
                </div>
                <div class="arrange_unit">
                  <div class="arrange">
                    <div class="arrange_unit">
                      <button
                        class="ybtn ybtn--primary ybtn--small business-search-form_button"
                        onClick={() => {
                          localStorage.setItem("search1", this.state.search1);
                          this.props.history.push("/searchrestaurant");
                        }}
                        value="submit"
                      >
                        {" "}
                        Search
                        <span class="main-search_action-icon-wrap js-search-icon-wrap">
                          <span
                            aria-hidden="true"
                            styles="width: 24px; height: 24px;"
                            class="icon icon--24-search icon--size-24 icon--currentColor"
                          >
                            <svg role="img" class="icon_svg">
                              <use xlinkHref="#24x24_search" />
                            </svg>
                          </span>
                          <span class="u-offscreen">Search</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div>
              <div className="grid-container">
                <div className="ResDescription">
                  <div>
                    <div>
                      <table className="tables">
                        <thead>
                          <tr className="tbl-header">
                            <th>Name</th>
                            <th>Picture</th>

                            <th>Description</th>
                            <th>Contact Info</th>
                            <th>Address</th>
                            <th>City/Location</th>
                            <th>Order Now</th>
                          </tr>
                        </thead>
                        <tbody>
                          {restaurant}
                          <ul className="pagination">{links}</ul>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="maparea">
                  <MapContainer latlng={this.state.latlng} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AllRestaurant;
