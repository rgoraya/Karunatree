class CreateCharacters < ActiveRecord::Migration
  def self.up
    create_table :characters do |t|
      t.column :current_scene, :integer, :default => 1
      t.timestamps
    end
    
    # Add Character as an instance variable of User
    add_column :users, :character_id, :integer
  end

  def self.down
    drop_table :characters
    remove_column :users, :character_id
  end
end
