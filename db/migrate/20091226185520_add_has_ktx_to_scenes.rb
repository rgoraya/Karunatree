class AddHasKtxToScenes < ActiveRecord::Migration
  def self.up
    add_column :scenes, :has_ktx, :boolean, :null => false, :default => false
  end

  def self.down
    remove_column :scenes, :has_ktx
  end
end
