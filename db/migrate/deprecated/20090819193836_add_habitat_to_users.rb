class AddHabitatToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :habitat_id, :integer, :null => true
  end

  def self.down
    remove_column :users, :habitat_id
  end
end
