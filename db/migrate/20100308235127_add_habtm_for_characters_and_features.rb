class AddHabtmForCharactersAndFeatures < ActiveRecord::Migration
  def self.up
    # Create the join table for the HABTM association. Note join tables do not have an id
    create_table :characters_features, :id => false do |t|
      t.integer :character_id
      t.integer :feature_id
    end
    
    # Now create the foreign keys in Characters and Features
    add_column :characters, :feature_id, :integer
    add_column :features, :character_id, :integer
    
  end

  def self.down
    drop table :characters_features
    remove_column :characters, :feature_id
    remove_column :features, :character_id
  end
end
