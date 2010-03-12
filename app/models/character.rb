class Character < ActiveRecord::Base
  belongs_to :user
  has_many :behavior_bindings, :dependent => :destroy
  has_and_belongs_to_many :inventory, :class_name => "Feature"
end
