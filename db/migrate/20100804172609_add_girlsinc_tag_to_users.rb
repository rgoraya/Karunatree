class AddGirlsincTagToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :girlsinc, :boolean, :null => true
  end

  def self.down
    remove_column :users, :girlsinc
  end
end
