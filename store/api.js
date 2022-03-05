import axios from "axios";
import { authHeader, getJwtToken, getUserIdFromToken } from "./auth";

const API_URL = "http://localhost:8000";

class Api {

  async createOrganization(orgname) {
    await axios.post(
      API_URL + "/organization",
      {
        orgname: orgname
      },
      {
        headers: authHeader(),
      }
    )
    return await axios.post(
      API_URL + "/part_of",
      {
        userid: getUserIdFromToken(getJwtToken()),
        orgid: 2 // get orgid somehow
      },
      {
        headers: authHeader()
      }
    )
  }

  login(email, password) {
    return axios.post(API_URL + "/rpc/login", { email, password });
  }

  signup(firstname, lastname, email, password) {
    return axios.post(API_URL + "/rpc/signup", { firstname, lastname, email, password });
  }
}

export default new Api();
