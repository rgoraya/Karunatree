class AddAttachmentsProjectToSeedling < ActiveRecord::Migration
  def self.up
    add_column :seedlings, :project_file_name, :string
    add_column :seedlings, :project_content_type, :string
    add_column :seedlings, :project_file_size, :integer
    add_column :seedlings, :project_updated_at, :datetime
  end

  def self.down
    remove_column :seedlings, :project_file_name
    remove_column :seedlings, :project_content_type
    remove_column :seedlings, :project_file_size
    remove_column :seedlings, :project_updated_at
  end
end
