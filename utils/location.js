const GEOAPIFY_API_KEY = "de37c67a22f74e6f9a99bfcc33194c27";
const GOOGLE_API_KEY = "AIzaSyD2mP_sDlloOcwv6OLmYtATOJIcnDhcZcg";

export function getMapPreview(lat, lng) {
  const apiKey = GEOAPIFY_API_KEY;

  return (
    `https://maps.geoapify.com/v1/staticmap?` +
    `style=osm-bright-smooth&width=600&height=400&` +
    `center=lonlat:${lng},${lat}&zoom=14&` +
    `marker=lonlat:${lng},${lat};type:awesome;color:%23bb3f73;size:large;icon:location-pin&` +
    `apiKey=${apiKey}`
  );
}

// reverse geocode: get address from coordinates
export async function getAddress(lat, lng) {
  // geoapify reverse geocoding API
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch address!");
  }

  const data = await response.json();

  // pick formatted address safely
  const address = data.features[0]?.properties?.formatted;

  return address;
}
