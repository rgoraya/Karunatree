class AddAttachmentsAudioMessageToSeedling < ActiveRecord::Migration
  def self.up
    add_column :seedlings, :audio_message_file_name, :string
    add_column :seedlings, :audio_message_content_type, :string
    add_column :seedlings, :audio_message_file_size, :integer
    add_column :seedlings, :audio_message_updated_at, :datetime
  end

  def self.down
    remove_column :seedlings, :audio_message_file_name
    remove_column :seedlings, :audio_message_content_type
    remove_column :seedlings, :audio_message_file_size
    remove_column :seedlings, :audio_message_updated_at
  end
end
