class CreateKmlBundles < ActiveRecord::Migration
  def self.up
    create_table :kml_bundles do |t|
      t.column :user_id, :integer, :null => false
      t.column :primary, :text, :null => true
      t.timestamps
    end
  end

  def self.down
    drop_table :kml_bundles
  end
end
