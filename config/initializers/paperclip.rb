# Retrieves a seedlings friendly_id, i.e. the slug used to generate the URL for its show page
Paperclip.interpolates :seedling_slug do |attachment, style|
  attachment.instance.friendly_id
end

# Retrieves a users username
Paperclip.interpolates :username do |attachment, style|
  attachment.instance.username
end