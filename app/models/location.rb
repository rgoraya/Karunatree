class Location
  attr_reader :lat, :lon, :alt
  
  def initialize(lat, lon, alt)
    @lat = lat
    @lon = lon
    @alt = alt
  end
  
end
