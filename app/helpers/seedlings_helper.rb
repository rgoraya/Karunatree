module SeedlingsHelper
def text_field_with_auto_complete_with_id_checking(object, method,
tag_options = {}, completion_options = {})
  # lets just set the id now and not worry about it throughout
  id = tag_options[:id] || "#{object}_#{method}"

  (completion_options[:skip_style] ? "" : auto_complete_stylesheet) +
  text_field(object, method, tag_options) +
  content_tag("div", "", :id => "#{id}_auto_complete", :class =>
"auto_complete") +
  auto_complete_field(id,
    { :url => { :action =>
"auto_complete_for_#{object}_#{method}" } }.update(completion_options))
end


def formatted_links_to_users
  link_string = ""
  
  @seedling.users.each do |user|
    is_last = (user == @seedling.users.last)
    if(is_last && @seedling.users.count > 1)
      link_string << " & "
    end
    
    link_string << link_to(user.username, url_for(user))
    
    if(@seedling.users.count > 2 && !is_last)
      link_string << ", "
    end
  end
  
  return link_string
end

def boosts_description
  boost_string = ""
  if(@seedling.likes == 0)
    return "Like it? Boost it!"
  elsif(@seedling.likes == 1)
    return "1 Boost"
  else
    return @seedling.likes.to_s + " Boosts"
  end
end

# TODO: Can we cache the result of this function? It's needed
# by the more_by_links method which is called immediately afterwards
def has_related_works
  users_seedlings = Array.new
  @seedling.users.each do |user|
    users_seedlings = users_seedlings + user.seedlings
  end
  users_seedlings.uniq!
  users_seedlings.delete(@seedling)
  return users_seedlings.count > 1
end

def more_by_description
  if(@seedling.users.count == 1)
    return "More by " + link_to(@seedling.users.first.username, url_for(@seedling.users.first))
  else
    return "More by these artists"
  end
end

def more_by_links
  users_seedlings = Array.new
  @seedling.users.each do |user|
    users_seedlings = users_seedlings + user.seedlings
  end
  users_seedlings.uniq!
  users_seedlings.delete(@seedling)
  
  link_string = ""
  for i in (1..[2, users_seedlings.count].max)
    r = rand(users_seedlings.count)
    seedling = users_seedlings[r]
    link_string << link_to(image_tag(seedling.project.url(:square), :width => "60px", :id => "morebyimg"), url_for(seedling))
    users_seedlings.delete(seedling)
  end
  
  return link_string
end

end
