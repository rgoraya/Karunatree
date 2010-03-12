class ReviseCurrentSceneInCharacters < ActiveRecord::Migration
  def self.up
    remove_column :characters, :current_scene
    add_column :characters, :scene_name, :string, :null => false, :default => "None"
    add_column :characters, :subscene, :integer, :null => false, :default => 0
  end

  def self.down
    add_column :characters, :current_scene, :integer, :default => 1
    remove_column :characters, :scene_name
    remove_column :characters, :subscene
  end
end
