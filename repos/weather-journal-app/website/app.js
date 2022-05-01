/* Global Variables */
const APIKEY = "68ac0b83f88f79106591c868a1bf2bf1";
const weatherBaseURL = "";
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
/*
 *@description POSTS data and logs the response to the console
 *@params url  {String} url to be sent to
 *@params data {Object} data to be sent
 *@return a Promis resolve with the response
 */
const postData = async (url = "", data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const newResp = await response.text();
  console.log(newResp);
  return newResp;
};

/*
 *@description GETs data
 *@params url  {String} url to get fata from
 *@params data {Object} data to be sent
 *@return a Promise that resolves with the response
 */
const getData = async (url = "") => {
  const response = await fetch(url);
  const newData = await response.json();
  return newData;
};

/*
 *@description GETs weather data from open weather API
 *@params zip  {Number|String} zipcode to get weather at
 *@return a Promis resolved with the response
 */
const getWeatherData = async function (zip) {
  const locationUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${APIKEY}&units=imperial'`;
  const response = await fetch(locationUrl);
  const output = await response.json();
  return output;
};

/*
 *@description shows weather Data to the UI
 *@return a Promis resolve with undefined
 */
const showData = async () => {
  const data = await getData("http://localhost:8000/data");
  document.getElementById("date").innerHTML = data.date || "";
  document.getElementById("temp").innerHTML = data.temp
    ? Math.round(data.temp) + " degrees"
    : "";
  document.getElementById("content").innerHTML = data.feelings || "";
};

/*
 *@description click event callBack ro generate
 *@params evt {Object} event
 *@return undefined
 */
const evtListener = (evt) => {
  evt.preventDefault();
  const zipCode = document.getElementById("zip").value;
  const holderEntry = document.getElementById("feelings").value;
  let response = "";

  //check if zipcode input is not empty
  if (zipCode) {
    //get weather data from input
    getWeatherData(zipCode)
      //post the updated temperature to the local server
      .then((repsonse) => {
        const {
          main: { temp },
        } = repsonse;

        return postData("http://localhost:8000/add", {
          temp: temp,
          date: newDate,
          feelings: holderEntry,
        });
      })

      //show the server data in UI
      .then(() => {
        showData();
      })

      //handle all errors and exit graceully by printing the error
      .catch((err) => {
        console.log(err);
      });
  }
};

//show the data stored on the server
showData();

//add the click call back
document.getElementById("generate").addEventListener("click", evtListener);
