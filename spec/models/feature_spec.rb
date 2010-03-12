require File.dirname(__FILE__) + '/../spec_helper'

describe Feature do
  it "should be valid" do
    Feature.new.should be_valid
  end
end
