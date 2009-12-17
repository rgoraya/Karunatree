class CreateScenes < ActiveRecord::Migration
  def self.up
    create_table :scenes do |t|
        t.column :scene_number, :integer, :null => false
        t.column :name, :text
        t.column :script, :text
      t.timestamps
    end
  end

  def self.down
    drop_table :scenes
  end
end
