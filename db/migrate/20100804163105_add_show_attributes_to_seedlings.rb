class AddShowAttributesToSeedlings < ActiveRecord::Migration
  def self.up
    add_column :seedlings, :short_url, :string, :null => true
    add_column :seedlings, :likes, :integer, :null => false, :default => 0
    add_column :seedlings, :views, :integer, :null => false, :default => 0
  end

  def self.down
    remove_column :seedlings, :short_url
    remove_column :seedlings, :likes
    remove_column :seedlings, :views
  end
end
