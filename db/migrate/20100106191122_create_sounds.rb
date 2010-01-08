class CreateSounds < ActiveRecord::Migration
  def self.up
     create_table :sounds do |t|
          t.column :name, :string, :null => false
          t.column :path, :string, :null => false
          t.column :volume, :integer, :null => true
          t.column :start_position, :integer, :null => true
          t.column :fade_in_delay, :integer, :null => true
          t.column :fade_in_duration, :integer, :null => true
          t.column :fade_down_delay, :integer, :null => true
          t.column :fade_down_duration, :integer, :null => true
          t.column :fade_down_volume, :integer, :null => true
          t.column :loop, :boolean, :null => false, :default => false
        t.timestamps
      end
  end

  def self.down
    drop_table :sounds
  end
end
