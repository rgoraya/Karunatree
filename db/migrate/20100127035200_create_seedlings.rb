class CreateSeedlings < ActiveRecord::Migration
  def self.up
    create_table :seedlings do |t|
      t.references :user
      t.string :title, :default => "", :null => false
      t.string :description, :default => "", :null => false
      t.integer :votes, :default => 0, :null => false
      t.integer :transplanted_count, :default => 0, :null => false
      
      t.string :picture_file_name
      t.string :picture_content_type
      t.integer :picture_file_size
      t.datetime :picture_updated_at
      t.timestamps
    end
  end

  def self.down
    drop_table :seedlings
  end
end
