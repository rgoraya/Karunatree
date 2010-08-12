class AddUncreditedAuthorsToSeedlings < ActiveRecord::Migration
  def self.up
    remove_column :seedlings, :authors
    add_column :seedlings, :uncredited_authors, :integer, :null => true
  end

  def self.down
    add_column :seedlings, :authors, :string, :null => true
  end
end
