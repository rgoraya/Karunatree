#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

class Sound < ActiveRecord::Base
  def self.compress_to_json(name)
    return self.find_by_name(name).to_json()
  end
end
