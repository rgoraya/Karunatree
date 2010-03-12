class Responder < ActiveRecord::Base
  attr_accessible :locator, :description, :look_response, :look_trigger, :interact_response, :interact_trigger
  
  # By overriding this method, we specify that when features are
  # converted to corresponding URLs, the locator attribute should
  # be used (rather than id)
  def to_param
    locator
  end
end
