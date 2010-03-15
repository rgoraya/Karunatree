class CreateCharacters < ActiveRecord::Migration
  def self.up
    create_table :characters do |t|
      t.references :user
      t.column :current_scene, :integer, :default => 1
      t.timestamps
    end
  end

  def self.down
    drop_table :characters
    remove_column :users, :character_id
  end
end
