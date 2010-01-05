class AddSoundtrackToScenes < ActiveRecord::Migration
  def self.up
    add_column :scenes, :soundtrack, :string, :null => true
  end

  def self.down
    remove_column :scenes, :soundtrack
  end
end
