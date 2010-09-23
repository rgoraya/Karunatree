#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

class Location
  attr_reader :lat, :lon, :alt
  
  def initialize(lat, lon, alt)
    @lat = lat
    @lon = lon
    @alt = alt
  end
  
end
