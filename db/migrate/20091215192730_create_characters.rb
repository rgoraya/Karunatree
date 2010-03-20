class CreateCharacters < ActiveRecord::Migration
  def self.up
    create_table :characters do |t|
      t.column :user_id, :integer, :null => false
      t.column :current_scene, :integer, :default => 1
      t.timestamps
    end
  end

  def self.down
    drop_table :characters
  end
end
