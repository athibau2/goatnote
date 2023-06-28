import jwt_decode from "jwt-decode";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = NUXT_ENV_SUPABASE_URL
const supabaseKey = NUXT_ENV_SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

export function getJwtToken() {
    return localStorage.getItem("accessToken")
}

export function getUserIdFromToken(token) {
    const decoded = jwt_decode(token);
    return decoded; //.user_id
}

export function setJwtToken(token) {
    localStorage.setItem("accessToken", token);
}

export function deleteJwtToken() {
    localStorage.removeItem("accessToken");
}

// export function authHeader() {
//   let accessToken = getJwtToken();

//   if (accessToken) {
//     return { Authorization: "Bearer " + accessToken };
//   } else {
//     return {};
//   }
// }

