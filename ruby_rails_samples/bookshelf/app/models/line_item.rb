class LineItem < ActiveRecord::Base
  belongs_to :book
  belongs_to :cart
  
  def total_price
    price = book.discount_price ? book.discount_price : book.price
    price * quantity
  end
end
