class AddAmbientSoundToScenes < ActiveRecord::Migration
  def self.up
    add_column :scenes, :ambient_sound, :string, :null => true
  end

  def self.down
    remove_column :scenes, :ambient_sound
  end
end
