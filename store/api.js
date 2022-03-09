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
}

export default new Api();
