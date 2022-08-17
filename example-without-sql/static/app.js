let distanceMatrixService;
let map;
let originMarker;
let infowindow;
let circles = [];
let stores = [];
// The location of Austin, TX
const AUSTIN = { lat: 30.262129, lng: -97.7468 };

async function initialize() {
  initMap();

  // Add an info window that pops up when user clicks on an individual
  // location. Content of info window is entirely up to us.
  infowindow = new google.maps.InfoWindow();

  // Fetch and render stores as circles on map
  fetchAndRenderStores(AUSTIN);

  // Initialize the Places Autocomplete Widget
  initAutocompleteWidget();
}

const initMap = () => {
  // TODO: Start Distance Matrix service

  // The map, centered on Austin, TX
  map = new google.maps.Map(document.querySelector("#map"), {
    center: AUSTIN,
    zoom: 14,
    // mapId: 'YOUR_MAP_ID_HERE',
    clickableIcons: false,
    fullscreenControl: false,
    mapTypeControl: false,
    rotateControl: true,
    scaleControl: false,
    streetViewControl: true,
    zoomControl: true,
  });
};

const fetchAndRenderStores = async (center) => {
    // Fetch the stores from the data source
    stores = (await fetchStores(center)).features;
  
    // Create circular markers based on the stores
    circles = stores.map((store) => storeToCircle(store, map, infowindow));
};

const fetchStores = async (center) => {
  const url = `/data/dropoffs`;
  const response = await fetch(url);
  return response.json();
};

const storeToCircle = (store, map, infowindow) => {
    const [lng, lat] = store.geometry.coordinates;
    const circle = new google.maps.Circle({
      radius: 50,
      strokeColor: "#579d42",
      strokeOpacity: 0.8,
      strokeWeight: 5,
      center: { lat, lng },
      map,
    });
    circle.addListener("click", () => {
      infowindow.setContent(`${store.properties.business_name}<br />
        ${store.properties.address_address}<br />
        Austin, TX ${store.properties.zip_code}`);
      infowindow.setPosition({ lat, lng });
      infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
      infowindow.open(map);
    });
    return circle;
};

const initAutocompleteWidget = () => {
    // Add search bar for auto-complete
    // Build and add the search bar
    const placesAutoCompleteCardElement = document.getElementById("pac-card");
    const placesAutoCompleteInputElement = placesAutoCompleteCardElement.querySelector(
      "input"
    );
    const options = {
      types: ["address"],
      componentRestrictions: { country: "us" },
      map,
    };
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
      placesAutoCompleteCardElement
    );
    // Make the search bar into a Places Autocomplete search bar and select
    // which detail fields should be returned about the place that
    // the user selects from the suggestions.
    const autocomplete = new google.maps.places.Autocomplete(
      placesAutoCompleteInputElement,
      options
    );
    autocomplete.setFields(["address_components", "geometry", "name"]);
    map.addListener("bounds_changed", () => {
      autocomplete.setBounds(map.getBounds());
    });

  // Respond when a user selects an address
  // Set the origin point when the user selects an address
  originMarker = new google.maps.Marker({ map: map });
  originMarker.setVisible(false);
  let originLocation = map.getCenter();
  autocomplete.addListener("place_changed", async () => {
    // circles.forEach((c) => c.setMap(null)); // clear existing stores
    originMarker.setVisible(false);
    originLocation = map.getCenter();
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No address available for input: '" + place.name + "'");
      return;
    }
    // Recenter the map to the selected address
    originLocation = place.geometry.location;
    map.setCenter(originLocation);
    map.setZoom(15);
    originMarker.setPosition(originLocation);
    originMarker.setVisible(true);

    // await fetchAndRenderStores(originLocation.toJSON());
    // TODO: Calculate the closest stores
  });
};
  