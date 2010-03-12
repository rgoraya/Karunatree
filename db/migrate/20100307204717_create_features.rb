class CreateFeatures < ActiveRecord::Migration
  def self.up
    create_table :features do |t|
      t.string :locator, :null => false
      t.string :name, :null => true
      t.text :description, :null => true
      t.timestamps
    end
  end
  
  def self.down
    drop_table :features
  end
end
