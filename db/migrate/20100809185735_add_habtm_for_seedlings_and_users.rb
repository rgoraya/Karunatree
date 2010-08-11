class AddHabtmForSeedlingsAndUsers < ActiveRecord::Migration
  def self.up
    # Create the join table for the HABTM association. Join tables have no id
    create_table :seedlings_users, :id => false do |t|
      t.references :seedling
      t.references :user
    end
    
    remove_column :seedlings, :user_id
  end

  def self.down
    drop_table :seedlings_users
    add_column :seedlings, :user_id, :integer, :null => false
  end
end