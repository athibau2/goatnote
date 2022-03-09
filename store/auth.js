import jwt_decode from "jwt-decode";

export function getJwtToken() {
    if(process.client) {
        return localStorage.getItem("accessToken");
    }
}

export function getUserIdFromToken(token) {
    const decoded = jwt_decode(token);
    console.log(decoded);
    return decoded; //.user_id
}

export function setJwtToken(token) {
    if(process.client) {
        localStorage.setItem("accessToken", token);
    }
}

export function deleteJwtToken() {
    if(process.client) {
        localStorage.removeItem("accessToken");
    }
}

export function authHeader() {
  let accessToken = getJwtToken();

  if (accessToken) {
    return { Authorization: "Bearer " + accessToken };
  } else {
    return {};
  }
}

