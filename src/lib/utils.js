import Cookies from "universal-cookie";
const cookies = new Cookies();

const setToken = (token) => {
  cookies.set("CARALUNA:token", token, {
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  });
};

const getToken = () => {
  const token = cookies.get("CARALUNA:token");
  if (token) return token;
  return "";
};

const setUserData = (data) => {
  const token = cookies.set("CARALUNA:userData", data, { path: "/" });
  if (token) return token;
  return "";
};

const getUserData = () => {
  const userData = cookies.get("CARALUNA:userData");
  if (userData) return userData;
  return {};
};

const clearCookie = () => {
  cookies.remove("CARALUNA:token", { path: "/" });
  cookies.remove("CARALUNA:userData", { path: "/" });
};

const getCart = () => {
  const cart = cookies.get("CARALUNA:cart");
  if (cart) return cart;
  return [];
};

const setCartCookies = (data) => {
  cookies.set("CARALUNA:cart", data, { path: "/" });
};

export {
  setToken,
  getToken,
  setUserData,
  getUserData,
  clearCookie,
  setCartCookies,
  getCart,
};
