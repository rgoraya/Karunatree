class CreateUsersAndHabitats < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.column :username, :string
      t.column :email,    :string
      t.column :password, :string
      t.timestamps
    end
    
    create_table :habitats do |t|
      t.column :user_id,    :integer, :null => true
      t.column :latitude,   :decimal, :precision => 6, :scale => 3, :null => true
      t.column :longitude,  :decimal, :precision => 6, :scale => 3, :null => true
      t.timestamps
    end
    
  end

  def self.down
    drop_table :users
    drop_table :habitats
  end
  
end
