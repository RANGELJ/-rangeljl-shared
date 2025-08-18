const coordinatesGetDistanceInMeters = (
  coordinate1: [number, number],
  coordinate2: [number, number],
) => {
  const R = 6371e3 // Earth's radius in meters
  const lat1Rad = (coordinate1[0] * Math.PI) / 180
  const lon1Rad = (coordinate1[1] * Math.PI) / 180
  const lat2Rad = (coordinate2[0] * Math.PI) / 180
  const lon2Rad = (coordinate2[1] * Math.PI) / 180

  // Haversine formula
  const dLat = lat2Rad - lat1Rad
  const dLon = lon2Rad - lon1Rad
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

export default coordinatesGetDistanceInMeters
