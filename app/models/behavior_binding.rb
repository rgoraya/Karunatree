#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

class BehaviorBinding < ActiveRecord::Base
  belongs_to :character
  belongs_to :behavior
end
