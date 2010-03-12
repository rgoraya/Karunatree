class Behavior < ActiveRecord::Base
  belongs_to :feature
  has_many :behavior_bindings, :dependent => :destroy
  attr_accessible :locator, :description, :look_response, :look_trigger, :interact_response, :interact_trigger, :feature_id
  
  # By overriding this method, we specify that when behaviors are
  # converted to corresponding URLs, the locator attribute should
  # be used (rather than id)
  def to_param
    locator
  end
end
