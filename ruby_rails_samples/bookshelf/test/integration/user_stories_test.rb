require 'test_helper'

class UserStoriesTest < ActionDispatch::IntegrationTest
  def test_buy_a_book
    LineItem.delete_all
    Order.delete_all
    ruby_book = books(:ruby)
    
    get "/"
    assert_response :success
    assert_template "index"
    
    xhr :post, '/line_items', :book_id => ruby_book.id
    assert_response :success
    
    cart = Cart.find(session[:cart_id])
    assert_equal 1, cart.line_items.size
    assert_equal ruby_book, cart.line_items[0].book
    
    get "orders/new"
    assert_response :success
    assert_template "new"    
  end
end
