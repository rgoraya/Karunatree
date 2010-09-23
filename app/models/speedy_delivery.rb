#   Karunatree
#   Copyright 2009-2010 Derek Lyons & Karunatree. All Rights Reserved.
#   
#   Author: Derek Lyons

class SpeedyDelivery < ActionMailer::Base

  def test_mail(user)
    recipients  user.email
    from        "speedydelivery@karunatree.com"
    subject     "It works!"
    body        :user => user
  end
  
  def contact(email_params)
    subject     "[Karunatree] " << email_params[:subject]
    recipients  "site.admin@karunatree.com"
    from        email_params[:email]
    sent_on     Time.now.utc
    body        :message => email_params[:body], :name => email_params[:name]
  end

end
