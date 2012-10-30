require 'test_helper'

class CartTest < ActiveSupport::TestCase
    def setup
    @cart = Cart.create
    @ruby_book = books(:ruby)
    @rails_book = books(:rails)
  end
  
  def test_cart_add_duplicate_book
    item = @cart.add_book @ruby_book.id
    item.save
    item = @cart.add_book @ruby_book.id
    item.save
    
    assert_equal 1, @cart.line_items.size
    assert_equal 2, @cart.line_items[0].quantity
    assert_equal 2*@ruby_book.discount_price, @cart.total_price
  end
  
  def test_cart_add_unique_books
    item = @cart.add_book @ruby_book.id
    item.save
    item = @cart.add_book @rails_book.id
    item.save
    
    assert_equal 2, @cart.line_items.size
    assert_equal @ruby_book.discount_price + @rails_book.discount_price, @cart.total_price
  end
end
