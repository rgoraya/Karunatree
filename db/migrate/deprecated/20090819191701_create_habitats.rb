class CreateHabitats < ActiveRecord::Migration
  def self.up
    create_table :habitats do |t|
      t.column :user_id,    :integer, :null => true
      t.column :username,   :string,  :null => true
      t.column :latitude,   :decimal, :precision => 6, :scale => 3, :null => true
      t.column :longitude,  :decimal, :precision => 6, :scale => 3, :null => true
      t.timestamps
    end
  end

  def self.down
    drop_table :habitats
  end
end
