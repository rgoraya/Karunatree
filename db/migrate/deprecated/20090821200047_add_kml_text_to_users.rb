class AddKmlTextToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :kml, :text, :null => true
  end

  def self.down
    remove_column :users, :kml
  end
end
