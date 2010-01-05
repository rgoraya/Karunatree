class AddDropcapToScenes < ActiveRecord::Migration
  def self.up
    add_column :scenes, :dropcap, :string, :null => true, :default => 1
  end

  def self.down
    remove_column :scenes, :dropcap
  end
end
