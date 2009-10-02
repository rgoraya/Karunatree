module KmlBundleHelper
  
  def create_default_bundle(user)
    logger.debug "Writing new default bundle for user #{user.username}"
    buffer = ""
    @xm = Builder::XmlMarkup.new(:target => buffer, :indent => 2)
    
    @xm.instruct!
    @xm.kml("xmlns" => "http://www.opengis.net/kml/2.2", "xmlns:gx" => "http://www.google.com/kml/ext/2.2") {
      @xm.Placemark {
        @xm.name(@user.username)
        @xm.visibility("1")
        @xm.description("Welcome to KarunaSea!")
        @xm.Point {
          @xm.coordinates("0.000, 0.000, 0")
        }
      }
    }
    
    default_bundle = KmlBundle.new :primary => buffer
    user.kml_bundle = default_bundle
    user.save!
  end
  
end
