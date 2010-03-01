class AddSavedKmlToCharacters < ActiveRecord::Migration
  def self.up
    add_column :characters, :saved_kml, :text
  end

  def self.down
    remove_column :characters, :saved_kml
  end
end
