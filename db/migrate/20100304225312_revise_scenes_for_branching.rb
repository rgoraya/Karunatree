class ReviseScenesForBranching < ActiveRecord::Migration
  def self.up
    rename_column :scenes, :has_ktx, :has_kml
    change_column :scenes, :dropcap, :integer, :null => false, :default => 0
    change_column :scenes, :name, :text, :null => false
    remove_column :scenes, :scene_number
    add_column :scenes, :subscene, :integer, :null => false, :default => 0
    add_column :scenes, :next_scene_name, :string, :null => true
    add_column :scenes, :next_subscene, :integer, :null => true
    add_column :scenes, :prev_scene_name, :string, :null => true
    add_column :scenes, :prev_subscene, :string, :null => true
  end

  def self.down
    rename_column :scenes, :has_kml, :has_ktx
    change_column :scenes, :dropcap, :string, :null => true, :default => 1
    change_column :scenes, :name, :text
    add_column :scenes, :scene_number, :integer, :null => false
    remove_column :scenes, :subscene
    remove_column :scenes, :next_scene_name
    remove_column :scenes, :next_subscene
    remove_column :scenes, :prev_scene_name
    remove_column :scenes, :prev_subscene
  end
end