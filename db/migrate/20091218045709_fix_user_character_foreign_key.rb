class FixUserCharacterForeignKey < ActiveRecord::Migration
  def self.up
    # Drop the (incorrect) foreign key in Users
    remove_column :users, :character_id
    # Add User (the parent Model) as a foreign key within Character (the child Model)
    add_column :characters, :user_id, :integer, :null => false
  end

  def self.down
    add_column :users, :character_id, :integer
    remove_column :characters, :user_id
  end
end
