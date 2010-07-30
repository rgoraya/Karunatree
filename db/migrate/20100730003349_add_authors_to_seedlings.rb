class AddAuthorsToSeedlings < ActiveRecord::Migration
  def self.up
    add_column :seedlings, :authors, :string, :null => true
  end

  def self.down
    remove_column :seedlings, :authors
  end
end
