class AddHabtmForSeedlingsAndTags < ActiveRecord::Migration
  def self.up
    # Create the join table for the HABTM association. Join tables have no id
    create_table :seedlings_tags, :id => false do |t|
      t.references :seedling
      t.references :tag
    end
  end

  def self.down
    drop_table :seedlings_tags
  end
end
