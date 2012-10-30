class Book < ActiveRecord::Base
  has_many :line_item
  validates :title, :description, :image_url, :presence => true
  validates :title, :uniqueness => true
  validates :price, :numericality => {:greater_than_or_equal_to => 0.01}
  #validates :discount_price, :numericality => {greater_than_or_equal_to: 0}
  #validates :discount_price, :numericality => {:less_than => :price, :message => 'must be less than price'}
  validate :valid_discount_price?
  
  private
  def valid_discount_price?
    self.errors[:discount_price] << 'must be less than price' if self.discount_price && self.discount_price >= self.price    
    self.errors[:discount_price] << 'must be greater than zero' if self.discount_price && self.discount_price <= 0
  end
  
end
