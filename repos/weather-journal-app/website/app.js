/* Global Variables */
const APIKEY = "68ac0b83f88f79106591c868a1bf2bf1";
const weatherBaseURL = "";
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

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

const getData = async (url = "") => {
  const response = await fetch(url);
  const newData = await response.json();
  return newData;
};

const getWeatherData = async function (zip) {
  const locationUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${APIKEY}`;
  const response = await fetch(locationUrl);
  const output = await response.json();
  return output;
};
const showData = async () => {
  const data = await getData("http://localhost:8000/data");
  document.getElementById("date").innerHTML = data.date || "";
  document.getElementById("temp").innerHTML = data.temp || "";
  document.getElementById("content").innerHTML = data.feelings || "";
};
const evtListener = (evt) => {
  evt.preventDefault();
  const zipCode = document.getElementById("zip").value;
  const holderEntry = document.getElementById("feelings").value;
  let response = "";
  if (zipCode) {
    getWeatherData(zipCode)
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
      .then(() => {
        showData();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
document.getElementById("generate").addEventListener("click", evtListener);
showData();
