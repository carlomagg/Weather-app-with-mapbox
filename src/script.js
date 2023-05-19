mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9tYWdnNjciLCJhIjoiY2xobHpidXk2MHNjejNmb2R2dXB4Y3drNSJ9.72xtyXb1cHrO4C3IgXnGDg';
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [-122.4194, 37.7749],
	zoom: 12
});

const marker = new mapboxgl.Marker({
	draggable: true
}).setLngLat([-122.4194, 37.7749])
.addTo(map);

const apiKey = '6ab22ec74ad0eda542614db27cf6d3c5';

function getWeather(lng, lat) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`)
		.then(response => response.json())
		.then(data => {
			const temperature = Math.round(data.main.temp - 273.15);
			const description = data.weather[0].description;
			const location = data.name;
			const weather = `Current weather in ${location}: ${temperature}°C and ${description}.`;
			const popup = new mapboxgl.Popup({ closeOnClick: true })
				.setHTML(`<p>${weather}</p>`);
			marker.setPopup(popup).togglePopup();
		})
		.catch(error => console.log(error));
}

marker.on('dragend', () => {
	const lngLat = marker.getLngLat();
	getWeather(lngLat.lng, lngLat.lat);
});

document.getElementById("location").addEventListener("keyup", event => {
	if (event.key === "Enter") {
		const location = document.getElementById("location").value;
		fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxgl.accessToken}`)
			.then(response => response.json())
			.then(data => {
				const lngLat = data.features[0].center;
				marker.setLngLat(lngLat).addTo(map);
				getWeather(lngLat[0], lngLat[1]);
				map.flyTo({ center: lngLat });
			})
			.catch(error => console.log(error));
	}
});
