class CreateBehaviorBindings < ActiveRecord::Migration
  def self.up
    create_table :behavior_bindings do |t|
      t.string :locator, :null => false
      t.integer :character_id, :null => false
      t.integer :behavior_id, :null => false
      t.timestamps
    end
  end

  def self.down
    drop_table :behavior_bindings
  end
end
