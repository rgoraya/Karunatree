class Seedling < ActiveRecord::Base
  
  belongs_to :user
  
  composed_of :location,
    :class_name => "Location",
    :mapping => 
      [  #  db    ruby
        %w[ lat   lat ],
        %w[ lon   lon ],
        %w[ alt   alt ]
      ]
end