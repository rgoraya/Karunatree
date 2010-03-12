require File.dirname(__FILE__) + '/../spec_helper'

describe Behavior do
  it "should be valid" do
    Behavior.new.should be_valid
  end
end
