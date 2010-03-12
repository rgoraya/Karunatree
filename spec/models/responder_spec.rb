require File.dirname(__FILE__) + '/../spec_helper'

describe Responder do
  it "should be valid" do
    Responder.new.should be_valid
  end
end
