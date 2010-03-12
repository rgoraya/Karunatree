class CreateBehaviors < ActiveRecord::Migration
  def self.up
    create_table :behaviors do |t|
      t.string :locator, :null => false
      t.text :description
      t.text :look_response
      t.string :look_trigger
      t.text :interact_response
      t.string :interact_trigger
      t.integer :feature_id, :null => true
      t.timestamps
    end
  end
  
  def self.down
    drop_table :behaviors
  end
end
