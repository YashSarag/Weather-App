const userTab = document.querySelector('[user-tab]');
const searchTab = document.querySelector('[search-tab]');
const grantAccessContainer = document.querySelector('.grant-access-container');
const loader = document.querySelector('[loader]')
const errorImg = document.querySelector('[error-container]');
const errorMsg = document.querySelector('[error-msg]');
const grantAccessBtn = document.querySelector('[grant-access-btn]');
const searchCity = document.querySelector('[search-city]');
const showWeatherContainer = document.querySelector('.weather-info-container');
const searchContainer = document.querySelector('.search-container');


const API_key = 'd1845658f92b31c64bd94f06f7188c9c';
let currentTab = userTab;
currentTab.classList.add('current-tab');
useSessionStorage();

function useSessionStorage(){
    const userCoords = sessionStorage.getItem('user-coords');
    if(userCoords){
        const data = JSON.parse(userCoords);
        fetchUserData(data);
    }
    else{
        grantAccessContainer.classList.add('active');
    }
}

async function fetchUserData(position){

    try{
        const lat = position?.lat;
        const lon = position?.lon;
        loader.classList.add('active');
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data = await response.json();
        loader.classList.remove('active');
        renderOnUI(data);
    }
    catch(err){
        loader.classList.remove('active');
        errorMsg.innerText = 'Failed to fetch';
        errorImg.classList.add('active');
    }

}


grantAccessBtn.addEventListener('click',()=>{
    setUserPosition();
});

function setUserPosition(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getUserPosition);
    }
    else{
        alert("Geolocation not supported by your browser");
    }
}

function getUserPosition(position){
    grantAccessContainer.classList.remove('active');
    const data = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem('user-coords',JSON.stringify(data));
    useSessionStorage();
}


function searchCityFunc(){
    if(searchCity.value != ''){
        showWeatherContainer.classList.remove('active');
        errorImg.classList.remove('active');
        const city = searchCity.value;
        searchCity.value = "";
        fetchCityData(city);
    }
}

searchContainer.addEventListener('submit',(ev)=>{
    ev.preventDefault();
    searchCityFunc()
});


async function fetchCityData(city){
    try{
        loader.classList.add('active');
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
        const data = await response.json();
        loader.classList.remove('active');
        renderOnUI(data);
    }
    catch(err){
        // alert(err);
        loader.classList.remove('active');
        errorMsg.innerText = 'Failed to fetch';
        errorImg.classList.add('active');
    }
}


userTab.addEventListener('click',()=>switchTab(userTab));
searchTab.addEventListener('click',()=>switchTab(searchTab));


function switchTab(clickedTab){
    if(clickedTab == currentTab) return;

    currentTab.classList.remove('current-tab');
    currentTab = clickedTab;
    currentTab.classList.add('current-tab');
    if(searchContainer.classList.contains('active')){
        searchContainer.classList.remove('active');
        showWeatherContainer.classList.remove('active');
        errorImg.classList.remove('active');
        useSessionStorage();
    }
    else{
        grantAccessContainer.classList.remove('active');
        showWeatherContainer.classList.remove('active');
        errorImg.classList.remove('active');
        searchContainer.classList.add('active');
    }
}


function renderOnUI(data){
    if(data?.cod == '404'){
        loader.classList.remove('active');
        errorMsg.innerText = 'City not found';
        errorImg.classList.add('active');
        return;
    }

    const city = document.querySelector('.city');
    const countryImg = document.querySelector('.city-img');
    const weatherDesc = document.querySelector('.weather-desc');
    const weatherImg = document.querySelector('.weather-img');
    const temp = document.querySelector('.temp');
    const windSpeed = document.querySelector('[wind-speed]');
    const humidity = document.querySelector('[humidity]');
    const clouds = document.querySelector('[clouds]');

    city.innerText = data?.name;
    countryImg.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = data?.weather?.[0]?.main;
    weatherImg.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = (parseFloat(data?.main?.temp) - 273.15).toFixed(2) + '°C';
    windSpeed.innerText = data?.wind?.speed + 'm/s';
    humidity.innerText = data?.main?.humidity + '%';
    clouds.innerText = data?.clouds?.all + '%';
    showWeatherContainer.classList.add('active');

}