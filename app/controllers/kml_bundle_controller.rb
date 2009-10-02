class KmlBundleController < ApplicationController
  include KmlBundleHelper
  
  def transmit
    @user = User.find_by_id(params[:id])
    logger.debug "Looking up KML for user #{@user.username}"
    if @user.kml_bundle.nil?
      create_default_bundle(@user)
    end
    logger.debug "Transmitting primary KML."
    send_data @user.kml_bundle.primary, :filename => "karunatree-bundle.kml", :type => :kml
  end
  
end
